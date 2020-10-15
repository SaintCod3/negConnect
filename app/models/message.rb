class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user
  validates :chat, presence: true
end
