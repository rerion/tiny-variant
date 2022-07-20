# tiny-variant - tiny utility for dealing with variants in typescript


## Usage
```typescript
type MyVariant = Variant<{
    Sum: number[];
    Product: number[];
    Str: string;
    Empty: void;
}>;

const { Sum, Product, Str, Empty } = variant<VariantMap<MyVariant>>();

const someOption = Sum([1, 2, 7, 8]);

const reduced = match<MyVariant>(someOption, {
    Sum: arr => arr.reduce((a, b) => a+b),
    Product: arr => arr.reduce((a, b) => a*b),
    Str: s => s.length,
    Empty: () => 0,
}); // reduced == 18
````

## Warning
Implementation of `variant` function depends on `Proxy`