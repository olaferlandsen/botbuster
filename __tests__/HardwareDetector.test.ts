import HardwareDetector from '../src/detectors/HardwareDetector';
import Config from '../src/core/Config';
import Reporter from '../src/core/Reporter';

function createMockReporter() {
    return {
        notify: jest.fn(),
        listen: jest.fn(),
        getIssues: jest.fn(() => [])
    } as any;
}

describe('HardwareDetector', () => {
    let config: Config;
    let reporter: Reporter;

    beforeAll(() => {
        // Suppress WebGL error logs
        jest.spyOn(console, 'error').mockImplementation((msg: any) => {
            if (
                typeof msg === 'string' &&
                msg.includes('Not implemented: HTMLCanvasElement.prototype.getContext')
            ) {
                return;
            }
            return;
        });
    });

    beforeEach(() => {
        config = new Config({ suspiciousKeywords: [/fake/i] });
        reporter = createMockReporter();
        jest.resetModules();
        jest.clearAllMocks();
    });

    test('should notify suspicious media device or WebGL vendor', async () => {
        const detector = new HardwareDetector(config, reporter);

        Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
            value: () => ({
                getExtension: () => ({
                    UNMASKED_VENDOR_WEBGL: 'UNMASKED_VENDOR_WEBGL',
                    UNMASKED_RENDERER_WEBGL: 'UNMASKED_RENDERER_WEBGL'
                }),
                getParameter: (param: string) => {
                    if (param === 'UNMASKED_VENDOR_WEBGL') return 'FakeVendor';
                    if (param === 'UNMASKED_RENDERER_WEBGL') return 'FakeRenderer';
                    return null;
                }
            })
        });

        Object.defineProperty(navigator, 'mediaDevices', {
            value: {
                enumerateDevices: async () => [
                    { kind: 'videoinput', label: 'FakeCam 3000' },
                    { kind: 'audioinput', label: 'Real Mic' }
                ]
            },
            configurable: true
        });

        await detector.start();

        expect((reporter.notify as jest.Mock)).toHaveBeenCalledTimes(2);
        const calls = (reporter.notify as jest.Mock).mock.calls;

        expect(calls[0][0]).toMatch(/suspicious/i);
        expect(calls[1][0]).toMatch(/suspicious/i);
    });

    test('should NOT notify when vendor and renderer are normal', async () => {
        const detector = new HardwareDetector(config, reporter);

        Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
            value: () => ({
                getExtension: () => ({
                    UNMASKED_VENDOR_WEBGL: 'UNMASKED_VENDOR_WEBGL',
                    UNMASKED_RENDERER_WEBGL: 'UNMASKED_RENDERER_WEBGL'
                }),
                getParameter: (param: string) => {
                    if (param === 'UNMASKED_VENDOR_WEBGL') return 'Intel Inc.';
                    if (param === 'UNMASKED_RENDERER_WEBGL') return 'Intel Iris Xe';
                    return null;
                }
            })
        });

        Object.defineProperty(navigator, 'mediaDevices', {
            value: {
                enumerateDevices: async () => [
                    { kind: 'videoinput', label: 'Logitech HD Pro Webcam' },
                    { kind: 'audioinput', label: 'Realtek HD Audio Mic' }
                ]
            },
            configurable: true
        });

        await detector.start();

        expect((reporter.notify as jest.Mock)).not.toHaveBeenCalled();
    });

    test('should skip device check if mediaDevices is undefined', async () => {
        const config = new Config({ suspiciousKeywords: [/fake/i] });
        const reporter = createMockReporter();
        const detector = new HardwareDetector(config, reporter);

        Object.defineProperty(navigator, 'mediaDevices', {
            value: undefined,
            configurable: true
        });

        await expect(detector.start()).resolves.not.toThrow();
        expect((reporter.notify as jest.Mock)).not.toHaveBeenCalled();
    });

    test('should skip WebGL check if context is null', async () => {
        const config = new Config({ suspiciousKeywords: [/fake/i] });
        const reporter = createMockReporter();
        const detector = new HardwareDetector(config, reporter);

        Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
            value: () => null
        });

        await expect(detector.start()).resolves.not.toThrow();
        expect((reporter.notify as jest.Mock)).not.toHaveBeenCalled();
    });


});
