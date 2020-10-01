class User < ApplicationRecord
    has_secure_password
    has_one_attached :avatar
    has_one_attached :govID
    has_many :requests, dependent: :destroy 
    has_many :volunteers, dependent: :destroy 
    has_many :volunteered_requests, :through => :volunteers, :source => :request
    after_commit :add_default_avatar, :add_default_govID, on: %i[create update]

    def avatar_thumbnail
        if avatar.attached?
            avatar.variant(resize_to_fill: [150, 150, { gravity: 'North' }]).processed 
        else
            "missing.png"
        end
    end

    def govID_thumbnail
        if govID.attached?
            govID.variant(resize: "350x250!").processed 
        else
            "missing_card.png"
        end
    end
    
    private

    def add_default_avatar
        unless avatar.attached?
        avatar.attach(
            io: File.open(
            Rails.root.join(
                'app', 'assets', 'images', 'missing.png'
            )
            ), filename: 'missing.png',
            content_type: 'image/png',
            identify: false
        )
        end
    end 

    def add_default_govID
        unless govID.attached?
        govID.attach(
            io: File.open(
            Rails.root.join(
                'app', 'assets', 'images', 'missing_card.png'
            )
            ), filename: 'missing_card.png',
            content_type: 'image/png',
            identify: false
        )
        end
    end 
end
