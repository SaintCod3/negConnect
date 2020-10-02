class RemoveVolunteerCounterFromRequest < ActiveRecord::Migration[6.0]
  def change
    remove_column :requests, :volunteers_count
  end
end
