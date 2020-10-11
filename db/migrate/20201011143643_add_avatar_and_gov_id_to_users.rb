class AddAvatarAndGovIdToUsers < ActiveRecord::Migration[6.0]
  def change
     add_column :users, :avatar, :string
     add_column :users, :govid, :string
  end
end
