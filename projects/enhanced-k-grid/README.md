# Enhanced kendo-grid

The goal of this project was to create an excel like grid based on the existing kendo-grid. I didn't want to create a spreadsheet component, but a grid, which holds regular array data, which we can edit, select, copy, paste, with wich we can do calculations and create so called 'calculation grids'.

## Features

- change focus with tab
- select cells with shift
- select cells with mouse
- copy and paste values with visual effects
- copy and paste events
- calculate aggregates for selected cells
- frozen columns
- cell value changing and cell value changed events
- calculated rows
- calculated columns
- empty rows (as a separator)
- custom error messages for invalid data
- grouped rows (max 3 levels) with slide animation
- info tooltips (also with components as tooltip content)

## Documentation

**1. Basic usage**

To mark a grid as an enhanced one, use the attribute `enhancedGrid` on the griven grid, f. e.:

```html
<kendo-grid class="enhanced" style="width: 1500px" [style.maxHeight.%]="100" [kendoGridBinding]="rows" [kendoGridInCellEditing]="createFormGroup" [selectable]="selectableSettings" kendoGridSelectBy [(selectedKeys)]="selectedCells" [navigable]="true" [filterable]="true" [sortable]="true" [pageable]="true" [pageSize]="20" enhancedGrid> </kendo-grid>
```

It is important to note, that you have to add the class `enhanced` to the class list of the grid.

**2. Navigation and selecting**

By default, you can navigate within the grid with the arrow keys. If you want to navigate also with the `Tab` key, then set the following input property:

```html
[changeCellFocusWithTab]="true"
```

If you want to select cells while holding the `Shift` key or with the mouse, then add the following input properties to the grid:

```html
[selectingWithShift]="true" [selectingWithMouse]="true"
```
