class AddLocationToRequests < ActiveRecord::Migration[6.0]
  def change
    add_column :requests, :city, :string
  end
end
