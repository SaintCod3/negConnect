class AddVolunteersCountToRequests < ActiveRecord::Migration[6.0]
  def change
    add_column :requests, :volunteers_count, :integer
  end
end
