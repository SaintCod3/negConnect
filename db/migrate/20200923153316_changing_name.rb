class ChangingName < ActiveRecord::Migration[6.0]
  def up
    rename_column :request_types, :request_type, :name
  end

  def down
    rename_column :request_types, :name, :request_type
  end
end
