class RemoveVolunteerFromConversation < ActiveRecord::Migration[6.0]
  def change
    remove_reference :conversations, :volunteer, null: false, foreign_key: true
  end
end
