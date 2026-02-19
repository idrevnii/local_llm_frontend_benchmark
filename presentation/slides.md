---
theme: seriph
title: "Локальные LLM: Приватный AI на вашем железе"
transition: slide-left
colorSchema: light
aspectRatio: 16/9
canvasWidth: 980
fonts:
  sans: Inter
  mono: JetBrains Mono
highlighter: shiki
lineNumbers: false
drawings:
  enabled: false
htmlAttrs:
  lang: ru
layout: center
class: text-center
---

# Локальные LLM

<p style="font-size: 1.2em; color: #475569; margin-top: -4px;">Приватный AI на вашем железе</p>

<div style="margin-top: 36px; display: flex; gap: 20px; justify-content: center;">
  <div style="flex: 1; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <div style="font-size: 2.4em; font-weight: 800; color: #0f172a; line-height: 1;">3</div>
    <div style="font-size: 0.75em; color: #64748b; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">модели</div>
  </div>
  <div style="flex: 1; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <div style="font-size: 2.4em; font-weight: 800; color: #0f172a; line-height: 1;">20</div>
    <div style="font-size: 0.75em; color: #64748b; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">практических задач</div>
  </div>
  <div style="flex: 1; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <div style="font-size: 2.4em; font-weight: 800; color: #0f172a; line-height: 1;">5</div>
    <div style="font-size: 0.75em; color: #64748b; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">уровней сложности</div>
  </div>
</div>

<!--
Всем привет! Сегодня говорим про локальные LLM.
2026 год. AI повсюду. Но часто мы не можем использовать облачные решения из-за политик безопасности.
Посмотрим, на что способны локальные модели сегодня.
-->

---
layout: section
---

# 1. Зачем это нужно?

Почему не использовать облака?

---

# Ограничения облачных решений

<v-clicks>

<div style="display: flex; gap: 16px; margin-top: 24px;">
<div class="glass-card" style="flex: 1; border-color: #fecaca; background: rgba(254, 242, 242, 0.7);">
<h3 style="margin: 0; color: #b91c1c;">🔒 Безопасность</h3>
<p class="text-sm op-80" style="margin: 12px 0 0;">Отправка проприетарного кода на сторонние серверы часто запрещена NDA.</p>
</div>
<div class="glass-card" style="flex: 1; border-color: #fde68a; background: rgba(255, 251, 235, 0.7);">
<h3 style="margin: 0; color: #b45309;">💰 Стоимость</h3>
<p class="text-sm op-80" style="margin: 12px 0 0;">Enterprise-подписки дороги, а оплата зарубежных сервисов усложнена.</p>
</div>
<div class="glass-card" style="flex: 1; border-color: #bfdbfe; background: rgba(239, 246, 255, 0.7);">
<h3 style="margin: 0; color: #1d4ed8;">🌐 Автономность</h3>
<p class="text-sm op-80" style="margin: 12px 0 0;">Работа в самолёте, поезде или местах с нестабильным интернетом.</p>
</div>
</div>

<div class="highlight-box" style="margin-top: 24px;">

**Раньше** локальные модели уступали облачным на порядок. <br>
**Сегодня** они справляются с рабочими задачами уровня Junior разработчика.

</div>

</v-clicks>

<!--
Три причины: Безопасность (NDA), Стоимость (сложность оплаты), Автономность (работа оффлайн).
-->

---
layout: section
---

# 2. Оборудование

На чём запускаем тесты?

---
layout: two-cols-header
---

# Конфигурация 1: Рабочий ноутбук

::left::

<div class="config-card">

**Железо**

- **CPU:** Intel Core i5 11400H
- **GPU:** RTX 3050 (4 GB)
- **RAM:** 16 GB DDR4

</div>

::right::

<div class="config-card" style="border-left: 4px solid var(--jan-color);">

**Модель**

- <span class="model-badge jan">Jan-v3</span> (q5_1)
- **Скорость:** ~12 tok/s
- **Параметры:** 4B

</div>

<style>
.two-cols-header { column-gap: 24px; }
</style>

<!--
Рабочий ноутбук. Модель на 4 миллиарда параметров.
Jan-v3 — оптимизированная версия Llama.
-->

---
layout: two-cols-header
---

# Конфигурация 2: MacBook

::left::

<div class="config-card">

**Железо**

- **Chip:** Apple M4
- **RAM:** 16 GB Unified

</div>

::right::

<div class="config-card" style="border-left: 4px solid var(--rnj-color);">

**Модель**

- <span class="model-badge rnj">RNJ-1</span> (MLX, 6-bit)
- **Скорость:** ~14 tok/s
- **Параметры:** 8B

</div>

<style>
.two-cols-header { column-gap: 24px; }
</style>

<!--
Mac на ARM чипах. Unified Memory позволяет эффективно использовать RAM для моделей.
-->

---
layout: two-cols-header
---

# Конфигурация 3: Мощный ПК

::left::

<div class="config-card">

**Железо**

- **GPU:** RTX 3080 (10 GB)
- **CPU:** Ryzen 7600X
- **RAM:** 32 GB DDR5

</div>

::right::

<div class="config-card" style="border-left: 4px solid var(--glm-color);">

**Модель**

- <span class="model-badge glm">GLM-4.7-Flash</span> (q4_k_m)
- **Скорость:** ~20 tok/s
- **Параметры:** 30B A3B (MoE)

</div>

<style>
.two-cols-header { column-gap: 24px; }
</style>

<!--
Мощный ПК. GLM-4.7 — 30 миллиардов параметров, архитектура Mixture of Experts.
-->

---

# Программное обеспечение

<div style="display: flex; gap: 16px; margin-top: 24px;">

<v-clicks>

<div class="glass-card" style="flex: 1; text-align: center;">
<div style="font-size: 2.5em; margin-bottom: 12px;">🚀</div>
<h4 style="margin: 0;">LM Studio</h4>
<p class="text-sm op-60" style="margin: 8px 0 0;">Простой запуск локального сервера. <br>Совместим с OpenAI API.</p>
</div>

<div class="glass-card" style="flex: 1; text-align: center;">
<div style="font-size: 2.5em; margin-bottom: 12px;">🔌</div>
<h4 style="margin: 0;">IDE и редакторы</h4>
<p class="text-sm op-60" style="margin: 8px 0 0;">VS Code: <b>Continue</b>, <b>Kilo Code</b>, <b>Roo Code</b>, <b>Cline</b>. <br><b>Void Editor</b> — AI-native редактор.</p>
</div>

<div class="glass-card" style="flex: 1; text-align: center;">
<div style="font-size: 2.5em; margin-bottom: 12px;">⌨️</div>
<h4 style="margin: 0;">CLI-инструменты</h4>
<p class="text-sm op-60" style="margin: 8px 0 0;"><b>opencode</b>, <b>crush</b>, <b>mini-swe-agent</b>. <br>Автономные агенты из терминала.</p>
</div>

</v-clicks>

</div>

<!--
Используем LM Studio как сервер. Клиенты: VS Code плагины, Void Editor, CLI-инструменты.
-->

---
layout: section
---

# 3. Методология

Как проводилось тестирование

---

# Подход к тестированию

<v-clicks>

- **Реальные задачи.** Вместо синтетических алгоритмов — реальные сценарии фронтенд-разработки.
- **Стек технологий.** React, TypeScript, Modern CSS.
- **Условия.** Контекст 32k токенов. Одна попытка на решение (pass@1).

</v-clicks>

<div v-click class="highlight-box" style="margin-top: 24px;">

### Бенчмарк
**20 задач разной сложности**

От верстки простых компонентов до отладки сложных race condition и рефакторинга.

</div>

<!--
Задачи, максимально приближенные к боевым.
Никакой абстрактной синтетики.
-->

---

# Уровни сложности

<div style="display: grid; grid-template-columns: 1fr 1.4fr; gap: 24px; margin-top: 20px;">

<div style="display: flex; flex-direction: column; gap: 16px;">

<v-clicks>

<div class="glass-card" style="padding: 16px;">
<h4 style="margin: 0;">🤖 Генерация</h4>
<p class="text-sm margin-0">Задачи подготовлены <b>Claude Opus 4.5</b> на основе реальных кейсов.</p>
</div>

<div class="glass-card" style="padding: 16px;">
<h4 style="margin: 0;">⚖️ Оценка</h4>
<p class="text-sm margin-0"><b>LLM-as-a-Judge</b> (Claude Opus 4.5). Оценка решения по шкале 1–10.</p>
</div>

</v-clicks>

</div>

<div v-click class="glass-card" style="padding: 0; overflow: hidden;">
<table style="margin: 0; font-size: 0.85em;">
  <tr style="background: rgba(0,0,0,0.02);">
    <th>LVL</th>
    <th>Тип задач</th>
  </tr>
  <tr>
    <td><span class="level-badge easy">EASY</span></td>
    <td>Кнопка, Flexbox, Counter</td>
  </tr>
  <tr>
    <td><span class="level-badge medium">MEDIUM</span></td>
    <td>useDebounce, Grid, Валидация</td>
  </tr>
  <tr>
    <td><span class="level-badge hard">HARD</span></td>
    <td>Рефакторинг, Оптимизация</td>
  </tr>
  <tr>
    <td><span class="level-badge expert">EXPERT</span></td>
    <td>Календарь, React Router v6</td>
  </tr>
  <tr>
    <td><span class="level-badge nightmare">HELL</span></td>
    <td>Сложные баги, Merge Conflict</td>
  </tr>
</table>
</div>

</div>

<!--
5 уровней сложности. От простого к сложному.
Оценка автоматизированная.
-->

---
layout: section
---

# 4. Результаты

Сравнение моделей

---

# Уровень 1: Базовые задачи
<span class="level-badge easy">EASY</span> Кнопка · Flexbox · Counter

| Задача | <span class="model-badge jan">Jan-v3</span> | <span class="model-badge rnj">RNJ-1</span> | <span class="model-badge glm">GLM-4.7</span> |
|--------|:---:|:---:|:---:|
| React Button | 10 ⭐ | 10 ⭐ | 10 ⭐ |
| CSS Flexbox | 10 ⭐ | 10 ⭐ | 10 ⭐ |
| Counter useState | 9 | 10 ⭐ | 10 ⭐ |
| **Среднее** | **9.67** | **10.0** | **10.0** |

<div v-click class="highlight-box mt-4">

✅ Рутинные задачи (вёрстка, бойлерплейт) успешно решаются всеми моделями. <br>Можно использовать даже на слабом железе.

</div>

<!--
Все модели справились отлично.
-->

---

# Уровень 2: Средняя сложность
<span class="level-badge medium">MEDIUM</span> useDebounce · Grid · UserCard · Форма · Спиннер

| Задача | <span class="model-badge jan">Jan-v3</span> | <span class="model-badge rnj">RNJ-1</span> | <span class="model-badge glm">GLM-4.7</span> |
|--------|:---:|:---:|:---:|
| useDebounce | 10 ⭐ | 9 | 10 ⭐ |
| CSS Grid | 9 | 8 | 10 ⭐ |
| UserCard | 9 | 9 | 9 |
| Форма с валидацией | **5** ❌ | 9 | 9 |
| CSS Spinner | 10 ⭐ | 10 ⭐ | 10 ⭐ |
| **Среднее** | **8.6** | **9.0** | **9.6** |

<div v-click class="shame-card text-sm" style="padding: 10px 16px;">

⚠️ **Jan-v3:** Ошибка в синтаксисе доступа к объекту ошибок (`new errors.confirmPassword`). <br>Код не запустился.

</div>

<!--
Jan-v3 допустила синтаксическую ошибку в валидации формы.
-->

---

# Уровень 3: Рефакторинг
<span class="level-badge hard">HARD</span> Рефакторинг · Оптимизация · Архитектура · Bugfix

| Задача | <span class="model-badge jan">Jan-v3</span> | <span class="model-badge rnj">RNJ-1</span> | <span class="model-badge glm">GLM-4.7</span> |
|--------|:---:|:---:|:---:|
| Рефакторинг | **4** ❌ | 7 | 9 |
| Оптимизация списка | 6 | 6 | 9 |
| Валидация | 7 | 8 | 8 |
| Debugging | **3** ❌ | 8 | 9 |
| **Среднее** | **5.0** | **7.25** | **8.75** |

<div v-click class="shame-card text-sm" style="padding: 10px 16px;">

🤔 **Jan-v3:** Вместо исправления кода оставила комментарий с решением. <br>
<i>Задача не была выполнена.</i>

</div>

<!--
Jan-v3 начала сдавать позиции. Вместо кода — советы.
-->

---

# Уровень 4: Экспертный уровень
<span class="level-badge expert">EXPERT</span> Календарь бронирования · Миграция Router v5 → v6

| Задача | <span class="model-badge jan">Jan-v3</span> | <span class="model-badge rnj">RNJ-1</span> | <span class="model-badge glm">GLM-4.7</span> |
|--------|:---:|:---:|:---:|
| Booking Calendar | **5** ❌ | 7 | 7 |
| Router v5→v6 | **3** ❌ | **8** ⬆️ | **5** ❌ |
| **Среднее** | **4.0** | **7.5** | **6.0** |

<v-clicks>

<div class="text-sm mt-4">
📅 <b>Календарь:</b> Jan-v3 ошиблась в расчётах дат (логика бронирования).
</div>

<div class="shame-card text-sm" style="padding: 10px 16px;">

🔥 <b>Router v6:</b>
<br>• Jan-v3 смешала синтаксис v5 и v6.
<br>• GLM вернула `<Route>` из компонента (ошибка React).
<br>• RNJ-1 справилась лучше всех, но пропустила `<Outlet />`.

</div>

</v-clicks>

<!--
Сложные задачи вызвали трудности у всех.
Миграция на Router v6 оказалась самой сложной темой.
-->

---

# Уровень 5: Сложные кейсы
<span class="level-badge nightmare">HELL</span> <span class="text-sm op-60">Баг в нескольких файлах · Reverse Engineering API · Разрешение merge-конфликта · Обнаружение противоречий в ТЗ</span>

| Задача | <span class="model-badge jan">Jan-v3</span> | <span class="model-badge rnj">RNJ-1</span> | <span class="model-badge glm">GLM-4.7</span> |
|--------|:---:|:---:|:---:|
| Multifile Bug Hunt | 6 | **4** ❌ | **9** ⭐ |
| Reverse Engineering | 7 | 8 | 8 |
| Merge Conflict | 6 | 7 | **9** ⭐ |
| Break Code (тесты) | **3** ❌ | **3** ❌ | **9** ⭐ |
| Stateful Debug | **1** ❌ | **10** ⭐ | **10** ⭐ |
| **Среднее L5** | **4.83** | **6.17** | **8.33** |

<div v-click class="text-sm mt-4">

🤯 **Stateful Debug:** Jan-v3 удалила конфигурацию и сгенерировала манифест Kubernetes. <br>
🏆 **GLM-4.7** показала хорошие агентские навыки на сложных задачах.

</div>

<!--
GLM-4.7 показала отличный результат на самых сложных задачах.
-->

---

# Итоговая таблица

| Уровень | <span class="model-badge jan">Jan-v3</span> | <span class="model-badge rnj">RNJ-1</span> | <span class="model-badge glm">GLM-4.7</span> |
|---------|:---:|:---:|:---:|
| L1 — Easy | 9.7 | **10.0** ⭐ | **10.0** ⭐ |
| L2 — Medium | 8.6 | 9.0 | **9.6** ⭐ |
| L3 — Hard | 5.0 ❌ | 7.25 | **8.75** ⭐ |
| L4 — Expert | 4.0 ❌ | **7.5** ⭐ | 6.0 |
| L5 — Hell | 4.8 ❌ | 6.17 | **8.33** ⭐ |

<div v-click style="display: flex; gap: 16px; margin-top: 24px;">
  <div class="glass-card" style="flex:1; text-align:center; padding:16px;">
    <div style="font-size:2em; font-weight:800; color:var(--jan-color);">6.25</div>
    <div class="text-sm op-60">Jan-v3</div>
  </div>
  <div class="glass-card" style="flex:1; text-align:center; padding:16px;">
    <div style="font-size:2em; font-weight:800; color:var(--rnj-color);">7.80</div>
    <div class="text-sm op-60">RNJ-1</div>
  </div>
  <div class="glass-card" style="flex:1; text-align:center; padding:16px; border: 2px solid #10b981;">
    <div style="font-size:2em; font-weight:800; color:var(--glm-color);">8.55</div>
    <div class="text-sm op-60">GLM-4.7 <span class="winner">WINNER</span></div>
  </div>
</div>

<!--
GLM-4.7 победила по очкам.
-->

---
layout: section
---

# 5. Разбор ошибок

Интересные провалы моделей

---

# Ошибка контекста
<span class="model-badge jan">Jan-v3</span> · Stateful Debug · **1/10**

**Задача:** отладить конфигурацию `api-gateway.yaml`.

```yaml
# Ответ модели:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
```

<div class="shame-card text-sm" style="padding: 10px 16px;">

Модель проигнорировала контекст задачи и сгенерировала **манифест Kubernetes** вместо исправления конфига gateway.

</div>

<!--
Модель полностью потеряла контекст.
-->

---

# Галлюцинации API
<span class="model-badge glm">GLM-4.7</span> · React Router v5→v6 · **5/10**

```tsx
// Ошибка 1: Возврат <Route> из компонента (недопустимо в v6)
function PrivateRoute({ component: Component, ...rest }) {
  return <Route {...rest} element={<Component />} />;
}

// Ошибка 2: Использование синтаксиса v5 в v6
<Navigate to={{ pathname: '/login', state: { from: location } }} />
```

<div class="text-sm mt-4">

Код синтаксически верный, но **нерабочий**. <br>Модель смешала две разные версии библиотеки (v5 и v6), создав нерабочий гибрид.

</div>

<!--
Смешивание версий библиотек — частая проблема.
-->

---

# Искажение задачи
<span class="model-badge rnj">RNJ-1</span> · Break Code · **3/10**

**Задача:** <i>«Напиши тесты, которые выявят баг в этом коде»</i>

```typescript
// Исходный код (с багом):
return age

// RNJ-1 молча исправила код:
return isNaN(age) ? 0 : age
```

<div class="shame-card text-sm" style="padding: 10px 16px;">

Модель самовольно исправила баг в коде, а затем написала тесты для <b>исправленной</b> версии. <br>
Формально код работает, но задача на создание падающего теста провалена.

</div>

<!--
Модель решила задачу, которую не просили (исправила код вместо написания теста).
-->

---
layout: section
---

# Итоги и рекомендации

---

# Рекомендации по выбору

<v-clicks>

<div class="rec-card jan">
<h4>💻 Слабый ноутбук → Помощник</h4>
<span class="model-badge jan">Jan-v3</span> или <b>Qwen 3</b>. <br>
Хорошо подходят для автодополнения кода и написания простых функций.
</div>

<div class="rec-card rnj">
<h4>🍎 Mac (M серия) → Второй пилот</h4>
<span class="model-badge rnj">RNJ-1</span>. <br>
Сбалансированное решение. Справляется с 80% повседневных задач, включая тесты и документацию.
</div>

<div class="rec-card glm">
<h4>🖥️ Рабочая станция → Эксперт</h4>
<span class="model-badge glm">GLM-4.7</span>. <br>
Решение для сложных задач: рефакторинг, архитектурный анализ, поиск неочевидных багов. <br>
<i>Требует значительных ресурсов GPU.</i>
</div>

</v-clicks>

<!--
Выбор модели зависит от железа и задач.
-->

---

# Как выбрать подходящую модель?

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px;">

<v-clicks>

<div class="glass-card" style="padding: 20px;">
<h3 style="margin: 0 0 12px;">🟢 Простой способ</h3>
<h4 style="margin: 0 0 8px; color: #1d4ed8;">LM Studio</h4>
<ul class="text-sm" style="margin: 0; padding-left: 20px;">
<li>Раздел <b>Staff Picks</b> — проверенные модели</li>
<li>Сразу видно, <b>поместится ли</b> модель на вашем устройстве</li>
<li>Один клик — скачал и запустил</li>
</ul>
</div>

<div class="glass-card" style="padding: 20px;">
<h3 style="margin: 0 0 12px;">🔴 Продвинутый способ</h3>
<h4 style="margin: 0 0 8px; color: #b91c1c;">r/LocalLLaMA</h4>
<ul class="text-sm" style="margin: 0; padding-left: 20px;">
<li>Мониторить <b>r/LocalLLaMA</b> — что реально запускают люди</li>
<li>Отличать <b>хорошие модели</b> от тех, что просто замаксили бенчмарки</li>
<li>Реальные отзывы > синтетические оценки</li>
</ul>
</div>

</v-clicks>

</div>

<div v-click class="highlight-box" style="margin-top: 24px;">

💡 **Совет:** Начните с LM Studio Staff Picks. Когда разберётесь — следите за r/LocalLLaMA для новинок.

</div>

<!--
Два подхода к выбору модели.
Простой: LM Studio, Staff Picks.
Продвинутый: r/LocalLLaMA.
-->

---
layout: statement
---

# Локальные модели — это инструмент

Это про **свободу** работать где угодно<br>и **безопасность** вашего кода.

<div style="font-size: 0.5em; opacity: 0.6; margin-top: 40px;">
Спасибо за внимание
</div>

<!--
Финальный слайд.
-->
