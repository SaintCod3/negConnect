class CreateRequestTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :request_types do |t|
      t.string :request_type

      t.timestamps
    end
  end
end
