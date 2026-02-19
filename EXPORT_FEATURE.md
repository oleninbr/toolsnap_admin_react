# Функціональність експорту даних

## Огляд

Додана можливість експортування даних у форматі CSV та PDF для всіх List компонентів.

## Як це працює

### Компоненти

1. **ExportButton** (`src/components/ExportButton.jsx`)
   - Кнопка з меню для вибору формату експорту
   - Показує меню з опціями CSV та PDF
   - Підтримує індикатор завантаження

2. **exportUtils** (`src/utils/exportUtils.js`)
   - `downloadCSV()` - експорт у CSV
   - `downloadPDF()` - експорт у PDF
   - `convertToCSV()` - конвертація даних у CSV
   - `getColumnsFromRecords()` - автоматичне визначення колонок

## Як додати експорт до List компонента

### Крок 1: Імпортуйте необхідні компоненти

```jsx
import {
  List,
  Datagrid,
  TextField,
  // ... інші потрібні компоненти
  TopToolbar,
  CreateButton,
} from "react-admin";
import { ExportButton } from "../../components/ExportButton";
```

### Крок 2: Створіть компонент для дій списку

```jsx
const YourListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton filename="your-resource-name" />
  </TopToolbar>
);
```

### Крок 3: Додайте компонент до List

```jsx
export const YourList = () => (
  <List actions={<YourListActions />}>
    {/* ... Datagrid і поля */}
  </List>
);
```

## Приклад

```jsx
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  TopToolbar,
  CreateButton,
} from "react-admin";
import { ExportButton } from "../../components/ExportButton";

const ProductListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton filename="products" />
  </TopToolbar>
);

export const ProductList = () => (
  <List actions={<ProductListActions />}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="price" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
```

## Особливості

### CSV експорт
- Автоматичне екранування лапок
- Правильне форматування для Excel
- Назва файлу з датою: `filename_YYYY-MM-DD.csv`

### PDF експорт
- Красивий формат з заголовками
- Автоматичне розбиття на сторінки
- Укладення довгого тексту
- Назва файлу з датою: `filename_YYYY-MM-DD.pdf`

## Налаштування

### Зміна назви файлу

```jsx
<ExportButton filename="my-custom-filename" />
```

Це призведе до експорту файлів:
- `my-custom-filename_2024-02-19.csv`
- `my-custom-filename_2024-02-19.pdf`

## Вже оновлені List компоненти

- ✅ ToolList
- ✅ UserList
- ✅ LocationList
- ✅ BrandList
- ✅ RoleList
- ✅ ModelList

## Які List компоненти ще потребують оновлення

Для додавання експорту до інших List компонентів, дотримуйтесь кроків вище:

- ToolTypeList
- ToolStatusList
- PhotoTypeList
- LocationTypeList
- ActionTypeList
- DetectedToolList
- ToolPhotoList
- ToolAssignmentList
- PhotoSessionList
- PhotoForDetectionList
