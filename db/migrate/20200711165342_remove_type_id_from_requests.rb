class RemoveTypeIdFromRequests < ActiveRecord::Migration[6.0]
  def change
    remove_column :requests, :typeID, :integer
  end
end
