

type KeyedMap<Key extends string = string, V = any> = {
    [key in Key]: V;
};

export type AnyVariant = {
    type: string;
    payload: any;
}

type M<Map extends KeyedMap> = {
    [key in keyof Map]: {
        type: key;
        payload: Map[key];
    }
};
type O<Map extends KeyedMap> = 
    Map extends KeyedMap<string, infer V> ?
    V : never;

export type Variant<Map extends KeyedMap> = O<M<Map>>;

export type VariantConstructor<Map extends KeyedMap> = {
    [key in keyof Map]: (payload: Map[key]) => {
        type: key;
        payload: Map[key];
    };
}

export type VariantMap<V extends AnyVariant> = {
    [key in V['type']]: Payload<V, key>;
}

export const variant = <V extends KeyedMap>(): VariantConstructor<V> => {
    const proxy = new Proxy({}, {
        get(_, prop: string) {
            return (payload: any) => ({
                type: prop,
                payload: payload,
            });
        }
    });

    return proxy as VariantConstructor<V>;
}


export type Payload<V extends AnyVariant, K extends V['type']> = (V & {
    type: K
})['payload'];
export type Matcher<V extends AnyVariant> = {
    [key in V['type']]: (arg: Payload<V, key>) => any;
}
export type MatcherResult<M extends { [key: string]: (...args: any) => any }> = M extends {
    [key in keyof M]: (arg: any) => infer R;
} ? R : never;

export const match = <T extends AnyVariant, M extends Matcher<T> = Matcher<T>>(value: T, matcher: M): MatcherResult<M> => {
    const { type, payload } = value;
    return (matcher as any)[type](payload);
}
