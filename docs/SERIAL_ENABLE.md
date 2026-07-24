# Serial enable mask (firmware)

The full-body firmware accepts:

```
E,<mask>
```

Body part groups (bit flags):

| Bit | Group |
|-----|-------|
| 0 | head |
| 1 | neck |
| 2 | arms |
| 3 | hands |
| 4 | legs |

Examples:

- `E,255` — enable all groups (wake path default)
- `E,3` — head + neck only
- `E,0` — disable all (safe idle)

Wake greeting path always prefers full enable before rest poses.
