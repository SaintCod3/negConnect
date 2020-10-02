class AddIsActiveToRequest < ActiveRecord::Migration[6.0]
  def change
    add_column :requests, :isActive, :boolean, default: true
  end
end
