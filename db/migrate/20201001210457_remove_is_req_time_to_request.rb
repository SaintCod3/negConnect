class RemoveIsReqTimeToRequest < ActiveRecord::Migration[6.0]
  def change
    remove_column :requests, :req_time
  end
end
