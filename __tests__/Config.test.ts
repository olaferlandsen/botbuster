import Config from '../src/core/Config';

describe('Config', () => {
    test('should return value for defined key', () => {
        const config = new Config({ threshold: 123 });
        expect(config.get('threshold')).toBe(123);
    });

    test('should return undefined for missing key', () => {
        const config = new Config({});
        expect(config.get('not_set')).toBeUndefined();
    });

    test('should set a new config key', () => {
        const config = new Config({});
        config.set('jumpThreshold', 75);
        expect(config.get('jumpThreshold')).toBe(75);
    });

    test('should update multiple keys using update()', () => {
        const config = new Config({ linearityThreshold: 0.9, edgeClickTolerance: 5 });
        config.update({ linearityThreshold: 0.95, movementIntervalTolerance: 3 });
        expect(config.get('linearityThreshold')).toBe(0.95);
        expect(config.get('edgeClickTolerance')).toBe(5);
        expect(config.get('movementIntervalTolerance')).toBe(3);
    });
});
