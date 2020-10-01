class RenameUserIdToUserIdInChats < ActiveRecord::Migration[6.0]
  def up
    rename_column :chats, :userID, :user_id
  end

  def down
    rename_column :chats, :user_id, :userID
  end
end
