const { default: handler } = require("../pages/api/hello");
import { createMocks } from 'node-mocks-http';
import { WebClient } from "@slack/web-api";

jest.mock("@slack/web-api", () => {
    const slack = {
        usergroups: {
            users: {
                update: jest.fn()
            }
        },
        pins: {
            list: jest.fn().mockResolvedValue({
                items: [{
                    message: {
                        username: "Engineering Rota",
                        ts: 'mock-message-timestamp'
                    }
                }]
            }),
            remove: jest.fn(),
            add: jest.fn()
        }
    }
    return { WebClient: jest.fn(() => slack) }
});

describe('hello', () => {
    let slack;
    beforeEach(() => {
        slack = new WebClient();
        jest.clearAllMocks();
    })
    it('should make a call to list pins', async () => {
        const { req, res } = createMocks({
            body: {
                channel: 'mock-channel',
                timestamp: 'mock-timestamp',
                firefighter: 'mock-firefighter'
            }
        });
        await handler(req, res);
        expect(slack.pins.list).toHaveBeenCalledWith({
            channel: 'mock-channel',
        });
    });

    it('resolves correctly', async () => {
        const { req, res } = createMocks({
            body: {
                channel: 'mock-channel',
                timestamp: 'mock-timestamp',
                firefighter: 'mock-firefighter'
            }
        });
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual(
            expect.objectContaining({
              success: 'great success',
            }),
        );
    });

    it('should make a call to remove pins if there is a last bot message', async () => {
        const { req, res } = createMocks({
            body: {
                channel: 'mock-channel',
                timestamp: 'mock-timestamp',
                firefighter: 'mock-firefighter'
            }
        });
        await handler(req, res);
        expect(slack.pins.remove).toHaveBeenCalledWith({
            channel: 'mock-channel',
            timestamp: 'mock-message-timestamp'
        });
    });

    it('should not make a call to remove pins if there is no last bot message', async () => {
        slack.pins.list = jest.fn().mockResolvedValue({
            items: []
        })
        const { req, res } = createMocks({
            body: {
                channel: 'mock-channel',
                timestamp: 'mock-timestamp',
                firefighter: 'mock-firefighter'
            }
        });
        await handler(req, res);
        expect(slack.pins.remove).not.toHaveBeenCalled();
    });

    it('should make a call to pin the last message', async () => {
        const { req, res } = createMocks({
            body: {
                channel: 'mock-channel',
                timestamp: 'mock-timestamp',
                firefighter: 'mock-firefighter'
            }
        });
        await handler(req, res);
        expect(slack.pins.add).toHaveBeenCalledWith({
            channel: 'mock-channel',
            timestamp: 'mock-timestamp'
        });
    });

    it('should make a call to update user groups', async () => {
        const { req, res } = createMocks({
            body: {
                channel: 'mock-channel',
                timestamp: 'mock-timestamp',
                firefighter: 'mock-firefighter'
            }
        });
        await handler(req, res);
        expect(slack.usergroups.users.update).toHaveBeenCalledWith({
            usergroup: 'S04QKARLE14',
            users: 'mock-firefighter,U2D1SE9FV,UDPUWG5KK,UBQRDLJ5A,UE1F0TZK7,U04M3CYH6A2'
        });
    });

    it('should throw an error if any params are missing', async () => {
        const { req, res } = createMocks();
        await handler(req, res);
        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual("Invalid parameters supplied");
    })
});