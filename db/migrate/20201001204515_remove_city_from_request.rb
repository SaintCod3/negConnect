class RemoveCityFromRequest < ActiveRecord::Migration[6.0]
  def change
    remove_column :requests, :city
  end
end
