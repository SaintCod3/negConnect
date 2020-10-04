class AddAgain < ActiveRecord::Migration[6.0]
  def change
    add_column :requests, :req_time, :datetime
  end
end
