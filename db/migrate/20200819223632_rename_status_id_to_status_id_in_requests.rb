class RenameStatusIdToStatusIdInRequests < ActiveRecord::Migration[6.0]
  def up
    rename_column :requests, :statusID, :status_id
  end

  def down
    rename_column :requests, :status_id, :statusID
  end
end