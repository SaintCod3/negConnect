class ChangeLatAndLngType < ActiveRecord::Migration[6.0]
  def change
    remove_column :requests, :lat
    add_column :requests, :lat, :float
  end
end
