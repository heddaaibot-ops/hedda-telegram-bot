---
name: xuzilong-task-tracking
description: Use when the user explicitly invokes $xuzilong-task-tracking or explicitly asks to maintain Tasks/outline.md, Tasks/task-current.md, or task archives in Xu Zilong academic projects.
---

# xuzilong 任务跟踪

## 1) 触发条件
仅在以下情况触发：
1. 用户在对话中显式输入 `$xuzilong-task-tracking`。
2. 用户明确要求维护 `Tasks/outline.md`、`Tasks/task-current.md` 或任务归档记录。

未满足以上条件时，不启用本 skill。

## 2) 硬边界
本 skill 只负责 `Tasks/` 体系中的任务记录、状态更新与归档管理，不负责：
1. 研究设计判断。
2. `Program`、`Results`、`Manuscripts`、`Submissions` 的流程编排。
3. 清洗、估计、导出、写作等技术规则。
4. 在未显式调用时自动创建、更新或归档 `Tasks/` 内容。
5. 将 `outline.md` 当作任务总览面板使用；`outline.md` 默认仅记录文章 idea，不承担探索分支任务导航职责。

即使任务涉及 `Program` 或 `Program -> Manuscripts` 联动，只要用户未显式调用 `$xuzilong-task-tracking`，就不得进入 `Tasks` 体系。

## 3) 目标
维护清晰、可追踪、可续接的分支内任务记录体系，确保：
1. 当前分支的任务目标明确。
2. 验收标准明确。
3. 最新进展可追溯。
4. 下一步动作明确。
5. 分支完成后的归档路径清晰。
6. 之后再次进入该探索分支时，能够快速恢复上下文。

## 4) 文件结构
标准结构如下：
1. `Tasks/outline.md`：文章 idea 总览；默认不承担探索分支任务索引职责。
2. `Tasks/task-current.md`：当前分支正在推进的单个活动任务。
3. `Tasks/archive/`：存放已完成、已冻结或已终止的任务快照；该层可在合适时合并回 `main`。

默认工作原则：
1. `task-current.md` 需要 git 追踪，但默认不作为合并回 `main` 的活动态文件。
2. `Tasks/archive/` 中的归档记录可作为最终任务记录合并回 `main`。

## 5) 预检流程
在任何任务记录动作前，必须先执行：
1. 确保 `Tasks/task-current.md` 与 `Tasks/archive/` 存在；缺失则创建。
2. 读取 `Tasks/task-current.md`。
3. 检查 `task-current.md` 是否具备必填字段。
4. 仅当用户明确要求维护文章 idea 时，才读取或修改 `Tasks/outline.md`。
5. 未完成预检，不进入正式任务更新。

## 6) `task-current.md` 必填字段
`Tasks/task-current.md` 至少应包含以下字段：
1. `task_id`
2. `objective`
3. `acceptance_criteria`
4. `planned_outputs`
5. `current_status`
6. `latest_result`
7. `next_action`
8. `updated_at`

当任务绑定某个探索分支时，强烈建议补充：
1. `background`
2. `branch_name`
3. `worktree_path`
4. `promotion_targets`
5. `related_files`
6. `risks`

## 7) 更新流程
每一轮出现实质进展后，应更新 `task-current.md`：
1. 更新 `current_status`。
2. 更新 `latest_result`，写明本轮被保留的有效结果或有效判断。
3. 更新 `planned_outputs` 的完成情况。
4. 对照 `acceptance_criteria` 标明已满足与未满足项。
5. 更新 `next_action`。
6. 更新 `updated_at`。
7. 若任务绑定探索分支，应同步更新 `related_files`、`promotion_targets` 或分支相关信息。

如果本轮仅讨论、尚无实质推进，可以补充状态说明，但不得伪造完成项。

## 8) 归档流程
当当前任务完成、终止、冻结或准备结束当前分支阶段时，应执行：
1. 将 `task-current.md` 内容冻结到 `Tasks/archive/<task_id>.md`。
2. 如有需要，清理或重置当前分支内的 `task-current.md`，为下一任务预留位置。
3. 若该探索分支的结果需要回到 `main`，默认优先合并 `Tasks/archive/` 中的归档文件，而不是活动态 `task-current.md`。

若任务中止，也应归档，并明确写出中止原因与未完成项。

## 9) 交付决策
每轮交付达到阶段终点后，必须向用户发出二选一决策：
1. A：归档当前任务，并准备新任务。
2. B：保留当前任务，更新 `task-current.md` 后继续推进。

未收到用户选择前，不自动切换到新的任务主体。

## 10) 书写要求
任务记录必须满足：
1. 语言简洁，避免空话。
2. 结论先行，状态明确。
3. 路径、产物、下一步都可执行。
4. 不把研究内容判断写成任务状态。
5. 不把任务文档写成流水账。

## 11) 内部优先级
本 skill 的优先级仅限 `Tasks/` 体系内部：
1. 触发条件
2. 硬边界
3. 预检流程
4. 必填字段
5. 更新流程
6. 归档流程
7. 交付决策
