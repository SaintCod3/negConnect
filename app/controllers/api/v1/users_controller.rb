class Api::V1::UsersController < Api::V1::BaseController 
    before_action :authorized, only: [:auto_login]

  # REGISTER
  def create
    @user = User.create(user_params)
    if @user.valid?
      token = encode_token({user_id: @user.id})
      render json: {user: @user, token: token}
    else
      render json: {}, status: 401
    end
  end

  # LOGGING IN
  def login
    @user = User.find_by(email: params[:email])
    if @user && @user.authenticate(params[:password])
      token = encode_token({user_id: @user.id})
      avatar = url_for(@user.avatar_thumbnail)
      govID = url_for(@user.govID_thumbnail)
      render json: {user: @user, token: token, avatar: avatar, govID: govID}, :except => [:password_digest]
    else
      render json: {}, status: 401
    end
  end

  def update
     @user = User.find_by(email: params[:email])
    if @user && @user.authenticate(params[:password])
      @user.update(user_params)
      render json:{ user: @user }, :except => [:password_digest]
    else
      render json: {}, status: 401
    end
  end

  def avatarUpload 
    user = User.find_by(id: params[:id])
    user.update(avatar: params[:avatar])
    avatar_url = rails_blob_path(user.avatar)
    render json:{ user: user, avatar_url: avatar_url}, :except => [:password_digest]
  end

  def govIDUpload 
    user = User.find_by(id: params[:id])
    user.update(govID: params[:govID])
    govID_url = rails_blob_path(user.govID)
    render json:{ user: user,  govID_url: govID_url}, :except => [:password_digest]
  end

  def auto_login
    render json: @user
  end

  private

  def user_params
    params.permit(:first_name, :last_name, :email, :password, :avatar, :govID)
  end

end
