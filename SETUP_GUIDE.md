# Husk'd Label — Полная пошаговая инструкция

---

## ШАГ 1: Настройка Supabase (база данных)

### 1.1 Создайте проект
1. Зайдите на https://supabase.com и зарегистрируйтесь (бесплатно).
2. Нажмите **"New Project"**, выберите имя и пароль для БД.
3. Дождитесь создания проекта (~2 минуты).

### 1.2 Скопируйте ключи
1. Зайдите в **Settings → API**.
2. Скопируйте:
   - **Project URL** (например `https://abcdefg.supabase.co`)
   - **anon public key** (длинная строка)

### 1.3 Создайте таблицу `profiles`
1. Зайдите в **SQL Editor** (левое меню).
2. Вставьте и выполните этот SQL:

```sql
-- Таблица профилей пользователей
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'model' CHECK (role IN ('model', 'recruiter')),
  referral_code TEXT UNIQUE,
  recruited_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Включаем RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политика: пользователь видит свой профиль
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Политика: рекрутер видит своих моделей
CREATE POLICY "Recruiters can view their recruits"
  ON public.profiles FOR SELECT
  USING (recruited_by = auth.uid());

-- Политика: пользователь может обновлять свой профиль
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Политика: сервис может вставлять профили
CREATE POLICY "Service can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Функция: автоматическое создание профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    split_part(NEW.email, '@', 1),
    COALESCE(NEW.raw_user_meta_data->>'role', 'model'),
    substring(NEW.id::text, 1, 8)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер: вызывает функцию при создании пользователя
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 1.4 Настройте Magic Link
1. Зайдите в **Authentication → Providers**.
2. Убедитесь, что **Email** включён.
3. Зайдите в **Authentication → URL Configuration**.
4. В поле **Site URL** введите адрес вашего сайта (например: `https://yourdomain.com`).
5. В **Redirect URLs** добавьте: `https://yourdomain.com/auth/callback`

---

## ШАГ 2: Настройка проекта на компьютере

### 2.1 Установите Node.js
- Скачайте Node.js 20+ с https://nodejs.org
- Проверьте: `node -v` должно показать v20+

### 2.2 Распакуйте проект
Скопируйте все файлы проекта в папку на компьютере.

### 2.3 Заполните `.env.local`
Откройте файл `.env.local` и впишите свои ключи:

```
NEXT_PUBLIC_SUPABASE_URL=https://ВАШ_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-ключ
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2.4 Установите зависимости
```bash
cd huskd-label
npm install
```

### 2.5 Запустите локально
```bash
npm run dev
```
Откройте http://localhost:3000 в браузере.

---

## ШАГ 3: Создание тестовых пользователей

### Через Supabase:
1. Зайдите в **Authentication → Users** в панели Supabase.
2. Нажмите **"Add user"** → **"Create new user"**.
3. Введите email, пароль (для теста), и в **User Metadata** впишите:
   - Для рекрутера: `{"role": "recruiter"}`
   - Для модели: `{"role": "model"}`

### Через Magic Link (в самом приложении):
1. Откройте http://localhost:3000/login
2. Введите email → получите ссылку → перейдите по ней
3. После первого входа роль будет "model" (по умолчанию)
4. Чтобы сменить на "recruiter", в Supabase SQL Editor выполните:
```sql
UPDATE profiles SET role = 'recruiter' WHERE email = 'email@рекрутера.com';
```

---

## ШАГ 4: Деплой на VPS (без Vercel)

### Вариант A: Docker (рекомендуется)

**На сервере должен быть установлен Docker и Docker Compose.**

1. Загрузите файлы проекта на сервер (через git, scp, или rsync):
```bash
scp -r ./huskd-label user@your-server-ip:/home/user/
```

2. Создайте файл `.env` на сервере:
```bash
cd /home/user/huskd-label
nano .env
```
Содержимое:
```
NEXT_PUBLIC_SUPABASE_URL=https://ВАШ_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-ключ
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

3. Запустите:
```bash
docker compose up -d --build
```

4. Сайт будет доступен на порту 3000. Настройте Nginx как reverse proxy (см. ниже).

### Вариант B: Без Docker (Node.js напрямую)

1. Установите Node.js 20+ на сервер:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Загрузите проект и установите зависимости:
```bash
cd /home/user/huskd-label
npm install
```

3. Создайте `.env.local` с вашими ключами (как в шаге 2.3, но с реальным доменом).

4. Соберите проект:
```bash
npm run build
```

5. Запустите:
```bash
# Простой запуск:
npm run start

# Или через PM2 (рекомендуется для продакшена):
npm install -g pm2
pm2 start npm --name "huskd-label" -- start
pm2 save
pm2 startup
```

### Настройка Nginx (reverse proxy)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Затем добавьте SSL через Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Как работает логика

### Роутинг:
- `/` → Landing (для всех)
- `/login` → Вход через Magic Link
- `/dashboard/recruiter` → Кабинет рекрутера (только для role=recruiter)
- `/dashboard/model` → Кабинет модели (только для role=model)
- Middleware автоматически перенаправляет на нужный дашборд

### Финансовая модель:
- **Модель** получает **70%** от валового дохода
- **Рекрутер** получает **10%** от валового дохода своих моделей
- Оставшиеся **20%** — комиссия платформы

### API `/api/balance`:
- Возвращает случайные данные (имитация API вебкам-сайтов)
- Когда подключите реальные API — замените логику в `app/api/balance/route.ts`

---

## Частые вопросы

**Q: Как добавить рекрутера?**
A: В Supabase SQL Editor: `UPDATE profiles SET role = 'recruiter' WHERE email = 'email';`

**Q: Как привязать модель к рекрутеру?**
A: В Supabase SQL Editor: `UPDATE profiles SET recruited_by = 'uuid-рекрутера' WHERE email = 'email-модели';`
Или модель переходит по реферальной ссылке рекрутера при регистрации.

**Q: Как подключить реальные API?**
A: Измените файл `app/api/balance/route.ts` — замените случайные данные на запросы к реальным API платформ.
