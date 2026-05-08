# StateKit 场景缺口矩阵

这份矩阵的目的不是给每个空白都补一个新名字，而是把 `category × 用户阶段` 的现状、缺口和判断标准放在一张表里，方便后续新增 recipe 时少拍脑袋。

当前 catalog 事实来源还是 `packages/shared/src/block-meta.ts`：7 个公开 category、21 个 preset recipes。这里的结论只用于规划下一批扩展，不改变公开 API。

## 阶段定义

- `start`：用户第一次进入这个 surface，或者刚打开这个工作流节点。
- `operate`：用户已经开始日常使用，正在持续处理内容。
- `blocked`：当前流程被权限、额度、失败或外部条件挡住。
- `recover`：用户需要一个明确的恢复路径。
- `finish`：一个明确任务结束后的收口。

## 缺口矩阵

| Category | start | operate | blocked | recover | finish | 判断 |
| --- | --- | --- | --- | --- | --- | --- |
| `empty` | `empty-collection`, `first-project` | `empty-search` | 通常不是阻断，更多是空文案 | `empty-search` 的清空筛选 / 重新搜索 | 交给 `SuccessState`，不要硬造空态收口 | 这类缺口大多是文案差异，不优先新增 recipe |
| `onboarding` | `onboarding-workspace` | `onboarding-members`, `onboarding-integration` | 一般不单独做 blocked，更多是页面状态控制 | 通常沿用同一条激活路径 | 完成后交给 `task-success` / 业务成功页 | 这一类已经比较完整，后续多半只补流程文案 |
| `loading` | `loading-workspace` | `loading-table`, `loading-import` | 一般不需要 blocked 变体 | 加载失败后切换到 `error` 类 | 不单独做 finish，加载结束后直接进入真实内容 | 这里最适合继续用文案和布局覆盖，而不是继续加名字 |
| `error` | `page-error` | `inline-error`, `offline-error` | `page-error`, `offline-error` | `inline-error` 的重试路径 | 交给 `SuccessState` 或业务流程完成页 | 高价值，但现有三种失败形态已经覆盖大头，新增只应针对反复出现的同类故障 |
| `permission` | `no-permission` | `role-restricted` | `session-expired` | `session-expired` 的重新登录路径 | 不单独做 finish | 这里的高频缺口通常是文案变体，不是新组件名 |
| `upgrade` | `upgrade-plan` | `trial-ending`, `usage-limit` | `upgrade-plan` | `usage-limit` 的升级后恢复 | 不单独做 finish | 如果后续出现 payment failed / billing suspended 这类反复场景，再考虑新 recipe |
| `success` | `task-success` | `invite-success`, `publish-success` | 通常不需要 blocked | 不单独做 recover | `task-success` 本身就是收口节点 | 这是收尾类，不要继续膨胀成一串完成页名 |

## 下一批最值得补的东西

1. `upgrade` 的账单边界场景最值得继续观察。如果同一类 surface 反复出现卡片失效、付款失败或席位不足，就值得补新的 recipe。
2. `error` 仍然有价值，但应该等某个失败模式在两个以上真实 surface 里重复出现，再把它从文案层升级成 recipe。
3. `permission` 和 `loading` 这两个 category，当前更适合继续压缩到文案和动作参数，而不是先开新入口。
4. `empty`、`onboarding` 和 `success` 三类，现阶段优先保证表达清楚，而不是追求更多名字。

## 扩展规则

- 先扩 `packages/shared/src/block-meta.ts` 里的 recipe，再同步 docs 和 example。
- 如果一个新场景可以被现有 category 用 `title`、`description`、`tone`、`layout` 和两个 CTA 说清，就只改文案，不新增 recipe。
- 只有当多个高频场景都明显不适合现有 7 个 category 时，才讨论第 8 类入口。
- 新增 recipe 后，优先检查 docs 首页、recipes 列表、recipe detail 和示例页是否已经自动吃到 shared 元数据，而不是再手写一份说明。
