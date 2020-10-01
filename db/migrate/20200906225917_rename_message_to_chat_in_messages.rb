class RenameMessageToChatInMessages < ActiveRecord::Migration[6.0]
  def up
    rename_column :messages, :message, :chat
  end

  def down
    rename_column :messages, :chat, :message
  end
end
