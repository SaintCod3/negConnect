class ChangingNameRequestTypes < ActiveRecord::Migration[6.0]
  def up
    rename_column :requests, :request_types_id, :request_type_id
  end

  def down
    rename_column :requests, :request_type_id, :request_types_id
  end
end

