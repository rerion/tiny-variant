import { VariantConstructor, variant, Variant, match, VariantMap } from "./index";


describe("variant function", () => {
    test("creates object with variant constructors", () => {
        const v1: VariantConstructor<{
            Option1: [string, number];
        }> = variant();
        expect(typeof v1.Option1).toBe('function');
    });

    test('created variants have "type" and "payload" fields', () => {
        const { Option } = variant<{
            Option: string;
        }>();

        const option = Option('hello');
        expect(option.payload).toBeDefined();
        expect(option.type).toBeDefined();
    });

    test('variant constructors set "type" to constructor name', () => {
        const v1: VariantConstructor<{
            Option1: [string, number];
            Option2: void;
            Option3: {
                someField: string;
            };
        }> = variant();
        expect(v1.Option1(['hello', 7]).type).toBe('Option1');
        expect(v1.Option2().type).toBe('Option2');
        expect(v1.Option3({ someField: 'value' }).type).toBe('Option3');
    });

    test('variant constructors put argument in "payload"', () => {
        const v1: VariantConstructor<{
            Option1: [string, number];
            Option2: void;
            Option3: {
                someField: string;
            };
        }> = variant();
        expect(v1.Option1(['hello', 7]).payload).toEqual(['hello', 7]);
        expect(v1.Option2().payload).toBeUndefined();
        expect(v1.Option3({ someField: 'value' }).payload).toEqual({ someField: 'value' });
    });
});

describe('match function', () => {
    type MyVariant = Variant<{
        Sum: number[];
        Product: number[];
        Str: string;
        Empty: void;
    }>;
    const { Sum, Product, Str, Empty } = variant<VariantMap<MyVariant>>();
    
    test('calls correct matching function with payload', () => {
        const sum1 = Sum([1, 7, 8, 2]);
        const mockSum = jest.fn(() => 0);
        const mockOthers = jest.fn(() => 0);
        match<MyVariant>(sum1, {
            Sum: mockSum,
            Product: mockOthers,
            Str: mockOthers,
            Empty: mockOthers,
        });
        expect(mockSum).toHaveBeenCalledWith([1, 7, 8, 2]);
        expect(mockOthers).not.toHaveBeenCalled();
    });

    test('returns matched function result', () => {
        const sum1 = Sum([1, 7, 8, 2]);
        const product1 = Product([5, 5]);
        const str1 = Str('hello');
        const empty1 = Empty();

        const reducer = (v: MyVariant) => match(v, {
            Sum: arr => arr.reduce((a, b) => a+b),
            Product: arr => arr.reduce((a, b) => a*b),
            Str: s => s.length,
            Empty: () => 0,
        });

        expect(reducer(sum1)).toBe(18);
        expect(reducer(product1)).toBe(25);
        expect(reducer(str1)).toBe(5);
        expect(reducer(empty1)).toBe(0);
    });
});