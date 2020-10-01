class RenameUserIdToUserIdInRequests < ActiveRecord::Migration[6.0]
  def up
    rename_column :requests, :userID, :user_id
  end

  def down
    rename_column :requests, :user_id, :userID
  end
end
