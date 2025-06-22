-- RenameIndex
ALTER TABLE `expense` RENAME INDEX `Expense_userId_fkey` TO `Expense_userId_idx`;

-- RenameIndex
ALTER TABLE `tag` RENAME INDEX `Tag_userId_fkey` TO `Tag_userId_idx`;
