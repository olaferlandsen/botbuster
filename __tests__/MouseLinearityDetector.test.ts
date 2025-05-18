import MouseLinearityDetector from '../src/detectors/MouseLinearityDetector';
import Config from '../src/core/Config';
import Reporter from '../src/core/Reporter';

describe('MouseLinearityDetector', () => {
    function createMockReporter(): Reporter {
        return {
            notify: jest.fn(),
            listen: jest.fn(),
            getIssues: jest.fn(() => [])
        } as any;
    }

    test('should NOT report if linearity is just below threshold', () => {
        const config = new Config({ linearityThreshold: 0.95 });
        const reporter = createMockReporter();
        const detector = new MouseLinearityDetector(config, reporter);
        detector.start();

        const movements = [
            { x: 0, y: 0 },
            { x: 5, y: 20 },
            { x: 10, y: 0 },
            { x: 15, y: 20 },
            { x: 20, y: 0 },
            { x: 25, y: 20 }
        ];

        movements.forEach(({ x, y }) => {
            const event = new MouseEvent('mousemove', { clientX: x, clientY: y });
            document.dispatchEvent(event);
        });

        detector.stop();

        expect((reporter.notify as jest.Mock)).not.toHaveBeenCalled();
    });

    test('should not crash on repeated identical points', () => {
        const config = new Config({ linearityThreshold: 0.5 });
        const reporter = createMockReporter();
        const detector = new MouseLinearityDetector(config, reporter);
        detector.start();

        const point = { x: 50, y: 50 };
        for (let i = 0; i < 6; i++) {
            const event = new MouseEvent('mousemove', {
                clientX: point.x,
                clientY: point.y,
                bubbles: true
            });
            document.dispatchEvent(event);
        }

        detector.stop(); // Ensure stop() is covered

        expect((reporter.notify as jest.Mock)).not.toHaveBeenCalled();
    });

    test('should discard old points when exceeding maxPoints', () => {
        const config = new Config({ linearityThreshold: 2 });
        const reporter = createMockReporter();
        const detector = new MouseLinearityDetector(config, reporter);

        const fakeEvent = (x: number, y: number): MouseEvent =>
            new MouseEvent('mousemove', { clientX: x, clientY: y });

        for (let i = 0; i < 25; i++) {
            detector.onMouseMove(fakeEvent(i, 0));
        }

        expect((reporter.notify as jest.Mock)).not.toHaveBeenCalled();
    });

    test('should not notify when all points are the same (zero distance)', () => {
        const config = new Config({ linearityThreshold: 0.5 });
        const reporter = createMockReporter();
        const detector = new MouseLinearityDetector(config, reporter);

        const identical = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });

        for (let i = 0; i < 6; i++) {
            detector.onMouseMove(identical);
        }

        detector.stop();

        expect((reporter.notify as jest.Mock)).not.toHaveBeenCalled();
    });
});
