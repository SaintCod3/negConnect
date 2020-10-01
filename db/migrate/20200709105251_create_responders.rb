class CreateResponders < ActiveRecord::Migration[6.0]
  def change
    create_table :responders do |t|
      t.integer :userID
      t.integer :requestID

      t.timestamps
    end
  end
end
