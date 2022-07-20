declare type KeyedMap<Key extends string = string, V = any> = {
    [key in Key]: V;
};
export declare type AnyVariant = {
    type: string;
    payload: any;
};
declare type M<Map extends KeyedMap> = {
    [key in keyof Map]: {
        type: key;
        payload: Map[key];
    };
};
declare type O<Map extends KeyedMap> = Map extends KeyedMap<string, infer V> ? V : never;
export declare type Variant<Map extends KeyedMap> = O<M<Map>>;
export declare type VariantConstructor<Map extends KeyedMap> = {
    [key in keyof Map]: (payload: Map[key]) => {
        type: key;
        payload: Map[key];
    };
};
export declare type VariantMap<V extends AnyVariant> = {
    [key in V['type']]: Payload<V, key>;
};
export declare const variant: <V extends KeyedMap<string, any>>() => VariantConstructor<V>;
export declare type Payload<V extends AnyVariant, K extends V['type']> = (V & {
    type: K;
})['payload'];
export declare type Matcher<V extends AnyVariant> = {
    [key in V['type']]: (arg: Payload<V, key>) => any;
};
export declare type MatcherResult<M extends {
    [key: string]: (...args: any) => any;
}> = M extends {
    [key in keyof M]: (arg: any) => infer R;
} ? R : never;
export declare const match: <T extends AnyVariant, M_1 extends Matcher<T> = Matcher<T>>(value: T, matcher: M_1) => MatcherResult<M_1>;
export {};
