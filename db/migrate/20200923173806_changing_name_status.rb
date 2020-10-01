class ChangingNameStatus < ActiveRecord::Migration[6.0]
  def up
    rename_column :statuses, :status, :name
  end

  def down
    rename_column :statuses, :name, :status
  end
end