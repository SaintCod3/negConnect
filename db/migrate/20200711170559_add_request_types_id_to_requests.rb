class AddRequestTypesIdToRequests < ActiveRecord::Migration[6.0]
  def change
    add_column :requests, :request_types_id, :integer
  end
end
