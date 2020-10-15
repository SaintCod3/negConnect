class User < ApplicationRecord
    has_secure_password
    has_many :requests, dependent: :destroy 
    has_many :volunteers, dependent: :destroy 
    has_many :volunteered_requests, :through => :volunteers, :source => :request
    validates :first_name, :last_name, :avatar, :govid, presence: true
    validates :email, presence: true, length: { maximum: 255 }, format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }
    validates :password, presence: true, length: { minimum: 8 }, :on => :create
end
