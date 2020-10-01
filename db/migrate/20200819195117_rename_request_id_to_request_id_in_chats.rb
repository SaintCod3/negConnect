class RenameRequestIdToRequestIdInChats < ActiveRecord::Migration[6.0]
  def up
    rename_column :chats, :requestID, :request_id
  end

  def down
    rename_column :chats, :request_id, :requestID
  end
end
