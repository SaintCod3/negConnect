class CreateRequests < ActiveRecord::Migration[6.0]
  def change
    create_table :requests do |t|
      t.text :description
      t.string :lat
      t.string :lng
      t.integer :typeID
      t.integer :userID
      t.integer :statusID

      t.timestamps
    end
  end
end
