class CreateChats < ActiveRecord::Migration[6.0]
  def change
    create_table :chats do |t|
      t.integer :userID
      t.integer :requestID
      t.text :message

      t.timestamps
    end
  end
end
