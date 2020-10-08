class ChangeLngType < ActiveRecord::Migration[6.0]
  def change
        remove_column :requests, :lng
    add_column :requests, :lng, :float
  end
end
