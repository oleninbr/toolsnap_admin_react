# ToolsNap Admin - Архітектура та реалізація ключових функціональних модулів

ToolsNap Admin - це система управління інвентарем інструментів з інтеграцією картографії, фотографій та детекції. Проект побудований на React Admin з глибокою інтеграцією з ASP.NET Core backend.

---

## 5.1 Управління інвентарем (Tools Management)

Модуль управління інвентарем є центральним у системі ToolsNap. Він реалізований на сторінці Tools та включає CRUD операції для інструментів, брендів, моделей, типів та статусів.

### 5.1.1 Архітектура управління інструментами

Модуль централізує всю логіку роботи з інструментами через React Admin dataProvider. Система відповідає за завантаження списків, фільтрацію, сортування, редагування та видалення записів.

**Основні компоненти:**

```jsx
// features/tools/ToolList.jsx
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  EditButton,
  DeleteButton,
  useRecordContext,
  useListContext,
  TopToolbar,
  CreateButton,
} from "react-admin";
import { ExportButton } from "../../components/ExportButton";

const ToolListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton filename="tools" />
  </TopToolbar>
);

const RowNumberField = () => {
  const record = useRecordContext();
  const { data } = useListContext();
  if (!record || !data) return null;
  const index = data.findIndex(r => r.id === record.id);
  return <span>{index + 1}</span>;
};

RowNumberField.defaultProps = { label: "#" };

export const ToolList = () => (
  <List actions={<ToolListActions />}>
    <Datagrid rowClick="edit">
      <RowNumberField />
      <TextField source="serial_number" label="Серійний номер" />

      <ReferenceField source="brand_id" reference="brands" label="Бренд">
        <TextField source="title" />
      </ReferenceField>

      <ReferenceField source="model_id" reference="models" label="Модель">
        <TextField source="title" />
      </ReferenceField>

      <ReferenceField source="tool_type_id" reference="tool_types" label="Тип">
        <TextField source="title" />
      </ReferenceField>

      <ReferenceField source="tool_status_id" reference="tool_statuses" label="Статус">
        <TextField source="title" />
      </ReferenceField>

      <DateField source="created_at" label="Дата створення" />

      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
```

### 5.1.2 Data Provider - інтеграція з API

Data Provider є посередником між React Admin компонентами та ASP.NET Core backend. Він реалізує стандартний інтерфейс React Admin для CRUD операцій.

```jsx
// admin/dataProvider.jsx
import { tokenManager } from "../utils/tokenManager";

const API_URL = "https://localhost:7062";

// Допоміжна функція для отримання заголовків авторизації
const getAuthHeaders = (isFormData = false) => {
  const token = tokenManager.getAccessToken();
  const headers = {};
  
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Запит з автоматичним повторенням при 401 (refresh token)
const fetchWithRetry = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData;
  
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeaders(isFormData),
    },
  });

  // Якщо токен розіцей, спробуємо оновити та повторити запит
  if (response.status === 401) {
    console.log("🔄 Токен розцієнен, оновлюю...");
    
    try {
      await tokenManager.refreshAccessToken();
      
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...getAuthHeaders(isFormData),
        },
      });
      
      console.log("Запит повторено з новим токеном");
    } catch (refreshError) {
      console.error("Помилка оновлення токена:", refreshError);
      throw response;
    }
  }

  return response;
};

const dataProvider = {
  getList: async (resource, params) => {
    const url = new URL(`${API_URL}/${resource}`);
    
    if (params.pagination) {
      url.searchParams.append("_start", (params.pagination.page - 1) * params.pagination.perPage);
      url.searchParams.append("_end", params.pagination.page * params.pagination.perPage);
    }
    
    if (params.filter) {
      Object.keys(params.filter).forEach(key => {
        url.searchParams.append(key, params.filter[key]);
      });
    }
    
    if (params.sort) {
      url.searchParams.append("_sort", params.sort.field);
      url.searchParams.append("_order", params.sort.order);
    }

    const response = await fetchWithRetry(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource}`);
    }

    const data = await response.json();
    const total = parseInt(response.headers.get("x-total-count") || "0", 10);

    return {
      data,
      total,
    };
  },

  getOne: async (resource, params) => {
    const response = await fetchWithRetry(
      `${API_URL}/${resource}/${params.id}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource} with id ${params.id}`);
    }

    return {
      data: await response.json(),
    };
  },

  update: async (resource, params) => {
    const response = await fetchWithRetry(
      `${API_URL}/${resource}/${params.id}`,
      {
        method: "PUT",
        body: JSON.stringify(params.data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update ${resource}`);
    }

    return {
      data: await response.json(),
    };
  },

  create: async (resource, params) => {
    const response = await fetchWithRetry(
      `${API_URL}/${resource}`,
      {
        method: "POST",
        body: JSON.stringify(params.data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create ${resource}`);
    }

    return {
      data: await response.json(),
    };
  },

  delete: async (resource, params) => {
    const response = await fetchWithRetry(
      `${API_URL}/${resource}/${params.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete ${resource}`);
    }

    return {
      data: await response.json(),
    };
  },
};

export default dataProvider;
```

### 5.1.3 Компоненти Create та Edit

Компоненти Create та Edit керуються React Admin FormField компонентами з автоматичною валідацією та обробкою помилок.

```jsx
// features/tools/ToolCreate.jsx
import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  required,
} from "react-admin";

export const ToolCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput 
        source="serial_number" 
        label="Серійний номер" 
        validate={required("Серійний номер обов'язковий")}
        fullWidth
      />

      <ReferenceInput
        source="brand_id"
        reference="brands"
        label="Бренд"
        validate={required("Бренд обов'язковий")}
      >
        <AutocompleteInput />
      </ReferenceInput>

      <ReferenceInput
        source="model_id"
        reference="models"
        label="Модель"
        validate={required("Модель обов'язкова")}
      >
        <AutocompleteInput />
      </ReferenceInput>

      <ReferenceInput
        source="tool_type_id"
        reference="tool_types"
        label="Тип інструменту"
        validate={required("Тип обов'язковий")}
      >
        <AutocompleteInput />
      </ReferenceInput>

      <ReferenceInput
        source="tool_status_id"
        reference="tool_statuses"
        label="Статус"
        validate={required("Статус обов'язковий")}
      >
        <AutocompleteInput />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

// features/tools/ToolEdit.jsx
import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  required,
} from "react-admin";

export const ToolEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput disabled source="id" />
      
      <TextInput 
        source="serial_number" 
        label="Серійний номер" 
        validate={required()}
        fullWidth
      />

      <ReferenceInput
        source="brand_id"
        reference="brands"
        label="Бренд"
      >
        <AutocompleteInput />
      </ReferenceInput>

      <ReferenceInput
        source="model_id"
        reference="models"
        label="Модель"
      >
        <AutocompleteInput />
      </ReferenceInput>

      <ReferenceInput
        source="tool_type_id"
        reference="tool_types"
        label="Тип інструменту"
      >
        <AutocompleteInput />
      </ReferenceInput>

      <ReferenceInput
        source="tool_status_id"
        reference="tool_statuses"
        label="Статус"
      >
        <AutocompleteInput />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
```

### 5.1.4 Підтримувальні CRUD ресурси

Система управління містить також CRUD операції для додаткових сутностей:

- **Brands** (Бренди) - виробники інструментів
- **Models** (Моделі) - моделі інструментів
- **Tool Types** (Типи інструментів) - класифікація за типом
- **Tool Statuses** (Статуси інструментів) - стан інструменту (Active, Inactive, Under Repair тощо)
- **Tool Assignments** (Призначення) - розподіл інструментів між локаціями та користувачами
- **Detected Tools** (Виявлені інструменти) - результати автоматичної детекції

---

## 5.2 Управління локаціями з географічною картою (Location Management with Geo-Mapping)

Модуль управління локаціями являє собою взаємодію між адміністративними даними та географічною інформацією, яка відображається на інтерактивній карті за допомогою Leaflet.

### 5.2.1 LocationMap - Картографічна компонента

Компонента LocationMap інтегрує Leaflet для відображення локацій на карті. Вона взаємодіє з React Admin контекстом для отримання поточних даних.

```jsx
// features/locations/LocationMap.jsx
import { useEffect, useRef } from "react";
import { useListContext } from "react-admin";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const LocationMap = () => {
  const { data, isLoading } = useListContext();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (isLoading) return;
    if (!mapRef.current) return;

    // Ініціалізація карти, центр в середині України
    const map = L.map(mapRef.current).setView([48.3794, 31.1656], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Видалення попередніх маркерів
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Додавання маркерів для кожної локації
    data?.forEach((location) => {
      if (location.latitude && location.longitude) {
        const marker = L.marker([location.latitude, location.longitude])
          .bindPopup(
            `<strong>${location.name}</strong><br/>${location.address}`
          )
          .addTo(map);

        // Підсвічування маркера при наведенні
        marker.on("mouseover", function () {
          this.openPopup();
        });
        marker.on("mouseout", function () {
          this.closePopup();
        });
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [data, isLoading]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        marginBottom: "20px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    />
  );
};
```

### 5.2.2 LocationList - Список з картою

LocationList містить як таблицю даних, так і картографічну сітку для точного розташування локацій.

```jsx
// features/locations/LocationList.jsx
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  ReferenceField,
  DateField,
  EditButton,
  DeleteButton,
  useRecordContext,
  useListContext,
  TopToolbar,
  CreateButton,
} from "react-admin";
import { ExportButton } from "../../components/ExportButton";
import { LocationMap } from "./LocationMap";

const LocationListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton filename="locations" />
  </TopToolbar>
);

const RowNumberField = () => {
  const record = useRecordContext();
  const { data } = useListContext();
  if (!record || !data) return null;
  const index = data.findIndex(r => r.id === record.id);
  return <span>{index + 1}</span>;
};

RowNumberField.defaultProps = { label: "#" };

export const LocationList = () => (
  <List actions={<LocationListActions />}>
    <LocationMap />
    <Datagrid rowClick="edit">
      <RowNumberField />
      <TextField source="name" label="Назва" />
      <ReferenceField source="locationTypeId" reference="location-types" label="Тип">
        <TextField source="title" />
      </ReferenceField>
      <TextField source="address" label="Адреса" />
      <NumberField source="latitude" label="Широта" />
      <NumberField source="longitude" label="Довгота" />
      <BooleanField source="isActive" label="Активна" />
      <DateField source="createdAt" label="Дата створення" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
```

### 5.2.3 MapPicker - Компонента вибору координат

MapPicker дозволяє виділити географічні координати безпосередньо на карті при створенні або редагуванні локації. Використовує react-leaflet для інтеграції Leaflet з React та Material-UI для додаткових UI елементів.

```jsx
// features/locations/MapPicker.jsx
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Box, Typography, CircularProgress } from "@mui/material";
import "leaflet/dist/leaflet.css";

// Виправлення для стандартних іконок маркерів в react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapClickHandler = ({ onCoordinateSelect }) => {
  useMapEvents({
    click(e) {
      onCoordinateSelect({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });
  return null;
};

const MapZoomHandler = ({ latitude, longitude }) => {
  const map = useMap();
  
  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 15);
    }
  }, [latitude, longitude, map]);
  
  return null;
};

// Функція для отримання адреси за координатами (Nominatim OpenStreetMap)
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "uk,en-US;q=0.9,en;q=0.8",
        },
      }
    );
    if (!response.ok) throw new Error("Geocoding failed");
    const data = await response.json();
    return data.display_name || '';
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return '';
  }
};

export const MapPicker = ({ source = "location", ...props }) => {
  const { field, fieldState } = useInput({ source, ...props });
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [position, setPosition] = useState(() => {
    const value = field.value;
    if (value?.latitude && value?.longitude) {
      return [value.latitude, value.longitude];
    }
    return [48.3794, 31.1656]; // Default: center of Ukraine
  });

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView(position, 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Додавання маркера в поточну позицію
    markerRef.current = L.marker(position)
      .bindPopup("Клацніть на карту для вибору координат")
      .addTo(map);

    // Обробка кліку на карту
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      // Оновлення маркера
      markerRef.current.setLatLng([lat, lng]);
      field.onChange({ latitude: lat, longitude: lng });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        marginTop: "20px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    />
  );
};
```

### 5.2.4 LocationCreate та LocationEdit

```jsx
// features/locations/LocationCreate.jsx
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ReferenceInput,
  AutocompleteInput,
  required,
} from "react-admin";
import { MapPicker } from "./MapPicker";

export const LocationCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput 
        source="name" 
        label="Назва локації" 
        validate={required()}
        fullWidth
      />

      <ReferenceInput
        source="locationTypeId"
        reference="location-types"
        label="Тип локації"
        validate={required()}
      >
        <AutocompleteInput />
      </ReferenceInput>

      <TextInput 
        source="address" 
        label="Адреса" 
        fullWidth
      />

      <MapPicker source="location" />

      <NumberInput 
        source="latitude" 
        label="Широта"
        step={0.0001}
      />

      <NumberInput 
        source="longitude" 
        label="Довгота"
        step={0.0001}
      />

      <BooleanInput 
        source="isActive" 
        label="Активна"
        defaultValue={true}
      />
    </SimpleForm>
  </Create>
);

// features/locations/LocationEdit.jsx
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ReferenceInput,
  AutocompleteInput,
} from "react-admin";
import { MapPicker } from "./MapPicker";

export const LocationEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput disabled source="id" />

      <TextInput 
        source="name" 
        label="Назва локації" 
        fullWidth
      />

      <ReferenceInput
        source="locationTypeId"
        reference="location-types"
        label="Тип локації"
      >
        <AutocompleteInput />
      </ReferenceInput>

      <TextInput 
        source="address" 
        label="Адреса" 
        fullWidth
      />

      <MapPicker source="location" />

      <NumberInput 
        source="latitude" 
        label="Широта"
        step={0.0001}
      />

      <NumberInput 
        source="longitude" 
        label="Довгота"
        step={0.0001}
      />

      <BooleanInput 
        source="isActive" 
        label="Активна"
      />
    </SimpleForm>
  </Edit>
);
```

---

## 5.3 Аутентифікація та управління токенами (Authentication & Token Management)

Аутентифікація в ToolsNap реалізована через JWT токени з механізмом відновлення та автоматичного оновлення. Система забезпечує безпечне зберігання токенів та автоматичну обробку їх закінчення.

### 5.3.1 Token Manager - централізоване управління токенами

Token Manager - це утилітарний модуль, що керує зберіганням, отриманням та оновленням JWT токенів.

```javascript
// utils/tokenManager.js
const API_URL = "https://localhost:7062";

const ACCESS_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_INFO_KEY = "user_info";

let refreshPromise = null;

const parseErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    return data?.message || fallback;
  } catch {
    try {
      const text = await response.text();
      return text || fallback;
    } catch {
      return fallback;
    }
  }
};

export const tokenManager = {
  // Зберігання токенів
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  // Отримання доступу токену
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Отримання refresh токену
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Зберігання інформації про користувача
  setUserInfo: (userInfo) => {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  },

  // Отримання інформації про користувача
  getUserInfo: () => {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    if (!userInfo) return null;
    try {
      return JSON.parse(userInfo);
    } catch {
      return null;
    }
  },

  // Очистка всіх токенів при виході
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  },

  // Оновлення доступу токену
  refreshAccessToken: async () => {
    // Запобігаємо одночасним запитам на оновлення
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          tokenManager.clearTokens();
          throw new Error("Failed to refresh token");
        }

        const data = await response.json();
        tokenManager.setTokens(data.accessToken, data.refreshToken);
        console.log("✅ Токен успішно оновлено");

        return data.accessToken;
      } catch (error) {
        console.error("❌ Помилка оновлення токена:", error);
        tokenManager.clearTokens();
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },
};
```

### 5.3.2 Auth Provider - інтеграція з React Admin

Auth Provider керує процесами входу, виходу, отримання дозволів та перевірки аутентифікації.

```jsx
// admin/authProvider.jsx
import { tokenManager } from "../utils/tokenManager";

const API_URL = "https://localhost:7062";

let autoRefreshInterval = null;

const parseErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    return data?.message || fallback;
  } catch {
    try {
      const text = await response.text();
      return text || fallback;
    } catch {
      return fallback;
    }
  }
};

const authProvider = {
  // Обробка входу
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response, "Помилка входу");
        throw new Error(message);
      }

      const data = await response.json();

      // Зберігаємо токени перед перевіркою ролі
      tokenManager.setTokens(data.accessToken, data.refreshToken);

      // Перевіряємо роль користувача через endpoint профілю
      const profileResponse = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        tokenManager.clearTokens();
        throw new Error("Доступ заборонено");
      }

      const profile = await profileResponse.json();
      const role = (profile.role || "").toLowerCase();

      // Дозволяємо тільки адміністраторів
      if (role !== "admin") {
        tokenManager.clearTokens();
        throw new Error("Необхідні права адміністратора");
      }

      // Зберігаємо інформацію про користувача
      tokenManager.setUserInfo({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: role,
      });

      // Запускаємо автоматичне оновлення токена
      startAutoRefresh();

      console.log("✅ Успішний вхід");
    } catch (error) {
      console.error("❌ Помилка входу:", error);
      throw error;
    }
  },

  // Обробка виходу
  logout: async () => {
    try {
      const token = tokenManager.getAccessToken();

      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Помилка виходу:", error);
    } finally {
      tokenManager.clearTokens();
      stopAutoRefresh();
      console.log("✅ Успішний вихід");
    }
  },

  // Перевірка аутентифікації
  checkAuth: async () => {
    const token = tokenManager.getAccessToken();
    if (!token) {
      throw new Error("No token");
    }
  },

  // Перевірка прав доступу
  getPermissions: async () => {
    const userInfo = tokenManager.getUserInfo();
    return userInfo?.role || "user";
  },

  // Отримання профілю користувача
  getIdentity: async () => {
    const userInfo = tokenManager.getUserInfo();
    if (!userInfo) {
      throw new Error("No user info");
    }
    return {
      id: userInfo.id,
      fullName: userInfo.fullName,
      avatar: undefined,
    };
  },
};

// Функції для автоматичного оновлення токена
const startAutoRefresh = () => {
  // Оновлюємо токен кожні 10 хвилин (перед його закінченням)
  autoRefreshInterval = setInterval(async () => {
    try {
      await tokenManager.refreshAccessToken();
    } catch (error) {
      console.error("Auto refresh failed:", error);
      stopAutoRefresh();
    }
  }, 10 * 60 * 1000);
};

const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
};

export default authProvider;
```

### 5.3.3 SignIn сторінка з валідацією та Material-UI

Сторінка входу використовує Material-UI компоненти з styled-components для створення красивого та адаптивного інтерфейсу.

```jsx
// pages/sign-in/SignIn.jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { useLogin, useNotify } from 'react-admin';
import ForgotPassword from './components/ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: '0 auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const login = useLogin();
  const notify = useNotify();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      notify('Login successful', { type: 'success' });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMsg);
      notify(errorMsg, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignInContainer direction="column">
      <Card variant="outlined">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            ToolsNap Admin
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
              disabled={loading}
            />
          </FormControl>

          <FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: 'baseline' }}
              >
                Forgot your password?
              </Link>
            </Box>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
              disabled={loading}
            />
          </FormControl>

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          <ForgotPassword open={open} handleClose={handleClose} />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <Divider>or</Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              disabled={loading}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              disabled={loading}
            >
              Sign in with Facebook
            </Button>
          </Box>
        </Box>
      </Card>
    </SignInContainer>
  );
}
```

---

## 5.4 Експорт даних (Data Export)

Модуль експорту дозволяє користувачам завантажувати дані у форматах CSV та PDF з будь-якої таблиці в системі.

### 5.4.1 ExportButton компонент

Компонент ExportButton використовує Material-UI для створення dropdown меню з опціями експорту.

```jsx
// components/ExportButton.jsx
import { useState } from "react";
import { useListContext } from "react-admin";
import {
  Button,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { downloadCSV, downloadPDF, getColumnsFromRecords } from "../utils/exportUtils";

export const ExportButton = ({ filename = "export" }) => {
  const { data } = useListContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const columns = getColumnsFromRecords(data);
      const timestamp = new Date().toISOString().split("T")[0];
      downloadCSV(data, columns, `${filename}_${timestamp}.csv`);
    } catch (error) {
      console.error("Export CSV error:", error);
    } finally {
      setIsExporting(false);
      handleClose();
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const columns = getColumnsFromRecords(data);
      const timestamp = new Date().toISOString().split("T")[0];
      downloadPDF(data, columns, `${filename}_${timestamp}.pdf`);
    } catch (error) {
      console.error("Export PDF error:", error);
    } finally {
      setIsExporting(false);
      handleClose();
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={isExporting ? <CircularProgress size={20} /> : <FileDownloadIcon />}
        disabled={isExporting || !data || data.length === 0}
      >
        Експорт
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleExportCSV}>
          Експорт як CSV
        </MenuItem>
        <MenuItem onClick={handleExportPDF}>
          Експорт як PDF
        </MenuItem>
      </Menu>
    </>
  );
};
```

### 5.4.2 Export Utils - утилітарні функції

```javascript
// utils/exportUtils.js
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

// Ініціалізація шрифтів для PDF
try {
  if (pdfFonts?.pdfMake?.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  } else if (pdfFonts?.vfs) {
    pdfMake.vfs = pdfFonts.vfs;
  }
  console.log("✅ VFS шрифти ініціалізовано успішно");
} catch (error) {
  console.error("⚠️ Помилка ініціалізації VFS:", error);
}

/**
 * Конвертація масиву об'єктів у CSV рядок
 */
export const convertToCSV = (data, columns) => {
  if (!data || data.length === 0) return "";

  // Створюємо заголовок
  const headers = columns.map(col => `"${col.label}"`).join(",");

  // Створюємо рядки
  const rows = data.map(record =>
    columns
      .map(col => {
        const value = record[col.key];
        // Екранування лапок і обгортання в лапки
        return `"${value !== undefined && value !== null ? String(value).replace(/"/g, '""') : ""}"`;
      })
      .join(",")
  );

  return [headers, ...rows].join("\n");
};

/**
 * Завантаження CSV файлу
 */
export const downloadCSV = (data, columns, filename = "export.csv") => {
  const csv = convertToCSV(data, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Завантаження PDF файлу
 */
export const downloadPDF = (data, columns, filename = "export.pdf") => {
  const tableBody = [
    columns.map(col => ({
      text: col.label,
      bold: true,
      fillColor: "#ababab",
      color: "white",
    })),
    ...data.map(record =>
      columns.map(col => {
        const value = record[col.key];
        return String(value !== undefined && value !== null ? value : "");
      })
    ),
  ];

  const docDefinition = {
    content: [
      {
        text: filename.replace(".pdf", ""),
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: Array(columns.length).fill("*"),
          body: tableBody,
        },
      },
    ],
    margin: [40, 40, 40, 40],
  };

  pdfMake.createPdf(docDefinition).download(filename);
};

/**
 * Автоматичне визначення колон з записів
 */
export const getColumnsFromRecords = (records) => {
  if (!records || records.length === 0) return [];

  const firstRecord = records[0];
  return Object.keys(firstRecord)
    .filter(key => key !== "id") // Видаляємо id колону
    .map(key => ({
      key,
      label: key.replace(/_/g, " ").toUpperCase(),
    }));
};
```

---

## 5.5 Управління фотографіями (Photo Management)

Система управління фотографіями включає декілька компонентів для роботи з фото сесіями, фото для детекції та фото інструментів.

### 5.5.1 PhotoSessions, PhotoForDetections та ToolPhotos

Кожний з цих мо модулів реалізує стандартні CRUD операції:

```jsx
// features/photoSessions/PhotoSessionList.jsx
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  EditButton,
  DeleteButton,
  TopToolbar,
  CreateButton,
} from "react-admin";
import { ExportButton } from "../../components/ExportButton";

const PhotoSessionListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton filename="photo-sessions" />
  </TopToolbar>
);

export const PhotoSessionList = () => (
  <List actions={<PhotoSessionListActions />}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="name" label="Назва" />
      <TextField source="description" label="Опис" />
      <ReferenceField source="location_id" reference="locations" label="Локація">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="session_date" label="Дата сесії" />
      <DateField source="created_at" label="Дата створення" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// features/photoForDetections/PhotoForDetectionList.jsx
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  ImageField,
  DateField,
  EditButton,
  DeleteButton,
  TopToolbar,
  CreateButton,
} from "react-admin";
import { ExportButton } from "../../components/ExportButton";

const PhotoForDetectionListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton filename="photos-for-detection" />
  </TopToolbar>
);

export const PhotoForDetectionList = () => (
  <List actions={<PhotoForDetectionListActions />}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <ImageField source="image_url" label="Мініатюра" />
      <ReferenceField source="photo_session_id" reference="photo-sessions" label="Сесія">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="file_name" label="Ім'я файлу" />
      <DateField source="captured_at" label="Дата захоплення" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
```

---

## Інтеграція всіх модулів - AdminApp

```jsx
// admin/AdminApp.jsx
import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import dataProvider from "./dataProvider";
import authProvider from "./authProvider";
import { MyLayout } from "./layout/Layout";
import SignIn from "../pages/sign-in/SignIn";
import { ProfilePage } from "../pages/profile/ProfilePage";

// Tools
import { ToolList } from "../features/tools/ToolList";
import { ToolEdit } from "../features/tools/ToolEdit";
import { ToolCreate } from "../features/tools/ToolCreate";

// Locations
import { LocationList } from "../features/locations/LocationList";
import { LocationEdit } from "../features/locations/LocationEdit";
import { LocationCreate } from "../features/locations/LocationCreate";

// Photo Sessions
import { PhotoSessionList } from "../features/photoSessions/PhotoSessionList";
import { PhotoSessionEdit } from "../features/photoSessions/PhotoSessionEdit";
import { PhotoSessionCreate } from "../features/photoSessions/PhotoSessionCreate";

// ... інші imports ...

export const AdminApp = () => (
  <Admin 
    dataProvider={dataProvider} 
    authProvider={authProvider}
    loginPage={SignIn}
    layout={MyLayout}
  >
    <CustomRoutes>
      <Route path="/profile" element={<ProfilePage />} />
    </CustomRoutes>

    {/* Tools Management */}
    <Resource name="tools" list={ToolList} edit={ToolEdit} create={ToolCreate} />
    <Resource name="brands" list={BrandList} edit={BrandEdit} create={BrandCreate} />
    <Resource name="models" list={ModelList} edit={ModelEdit} create={ModelCreate} />
    <Resource name="tool_types" list={ToolTypeList} edit={ToolTypeEdit} create={ToolTypeCreate} />
    <Resource name="tool_statuses" list={ToolStatusList} edit={ToolStatusEdit} create={ToolStatusCreate} />

    {/* Locations Management */}
    <Resource name="locations" list={LocationList} edit={LocationEdit} create={LocationCreate} />
    <Resource name="location-types" list={LocationTypeList} edit={LocationTypeEdit} create={LocationTypeCreate} />

    {/* Photo Management */}
    <Resource name="photo-sessions" list={PhotoSessionList} edit={PhotoSessionEdit} create={PhotoSessionCreate} />
    <Resource name="photo-for-detections" list={PhotoForDetectionList} edit={PhotoForDetectionEdit} create={PhotoForDetectionCreate} />
    <Resource name="tool-photos" list={ToolPhotoList} edit={ToolPhotoEdit} create={ToolPhotoCreate} />

    {/* Users & Roles */}
    <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
    <Resource name="roles" list={RoleList} edit={RoleEdit} create={RoleCreate} />

    {/* Assignments & Detected Tools */}
    <Resource name="tool-assignments" list={ToolAssignmentList} edit={ToolAssignmentEdit} create={ToolAssignmentCreate} />
    <Resource name="detected-tools" list={DetectedToolList} edit={DetectedToolEdit} create={DetectedToolCreate} />
  </Admin>
);
```

---

## Рекомендовані покращення

1. **Пошук і фільтрація** - додати розширені фільтри по датам, статусам
2. **Real-time оновлення** - інтегрувати SignalR для live notifікацій про зміни
3. **Batch операції** - можливість групового видалення, оновлення статусів
4. **Локалізація** - поповна підтримка укра їнської та англійської мов
5. **Роль-базовий доступ** - розширити систему дозволів для різних ролей
6. **Аудит логи** - зберігати historп всіх змін для аудиту
7. **Синхронізація** - забезпечити синхронізацію між браузерними вкладками

---

## Структура проекту

```
src/
├── admin/
│   ├── AdminApp.jsx
│   ├── authProvider.jsx
│   ├── dataProvider.jsx
│   ├── layout/
│   │   ├── Layout.jsx
│   │   └── Menu.jsx
│   ├── resources.jsx
│   └── menu.jsx
├── features/
│   ├── tools/
│   │   ├── ToolList.jsx
│   │   ├── ToolEdit.jsx
│   │   └── ToolCreate.jsx
│   ├── locations/
│   │   ├── LocationList.jsx
│   │   ├── LocationEdit.jsx
│   │   ├── LocationCreate.jsx
│   │   ├── LocationMap.jsx
│   │   └── MapPicker.jsx
│   ├── photoSessions/
│   ├── photoForDetections/
│   ├── toolPhotos/
│   └── ... інші ресурси ...
├── components/
│   ├── ExportButton.jsx
│   ├── FileInput.jsx
│   └── ... інші компоненти ...
├── utils/
│   ├── tokenManager.js
│   └── exportUtils.js
├── pages/
│   ├── sign-in/
│   │   └── SignIn.jsx
│   └── profile/
│       └── ProfilePage.jsx
└── theme/
    └── theme.js
```

---

## API Endpoints

### Аутентифікація
- `POST /auth/login` — вхід
- `POST /auth/logout` — вихід
- `GET /auth/profile` — отримання профілю
- `POST /auth/refresh` — оновлення токена

### Інструменти
- `GET /tools` — список інструментів
- `GET /tools/{id}` — отримання інструменту
- `POST /tools` — створення інструменту
- `PUT /tools/{id}` — оновлення інструменту
- `DELETE /tools/{id}` — видалення інструменту

### Локації
- `GET /locations` — список локацій
- `GET /locations/{id}` — отримання локації
- `POST /locations` — створення локації
- `PUT /locations/{id}` — оновлення локації
- `DELETE /locations/{id}` — видалення локації

### Фотографії
- `GET /photo-sessions` — список фото сесій
- `GET /photo-for-detections` — список фото для детекції
- `GET /tool-photos` — список фото інструментів

Цей документ описує ключові функціональні модулі ToolsNap Admin та їх реалізацію.
