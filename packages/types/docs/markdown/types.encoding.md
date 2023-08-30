<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@graph-drilldown/types](./types.md) &gt; [Encoding](./types.encoding.md)

## Encoding interface

<b>Signature:</b>

```typescript
export interface Encoding 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [binding](./types.encoding.binding.md) |  | [DataBinding](./types.databinding.md) |  |
|  [dataType?](./types.encoding.datatype.md) |  | string | <i>(Optional)</i> Data type of the column Used for selecting default scale types |
|  [domain?](./types.encoding.domain.md) |  | \[number, number\] | <i>(Optional)</i> Data domain for the bound column |
|  [field?](./types.encoding.field.md) |  | string | <i>(Optional)</i> Data field (column) to bind to |
|  [range?](./types.encoding.range.md) |  | \[number, number\] | <i>(Optional)</i> Output data range (units mapped to encoding: e.g., pixels) |
|  [scaleType?](./types.encoding.scaletype.md) |  | ScaleType | <i>(Optional)</i> Scale type to map values (only required for numeric scales) |
