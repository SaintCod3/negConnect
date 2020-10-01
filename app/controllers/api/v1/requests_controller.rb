class Api::V1::RequestsController < Api::V1::BaseController
  before_action :authorized
  
  def index
    # Limit of requests that we want to display 
    @limit = 4
    # Defining the page (@page can be used to return the current page), the page starts on 0
    @page = params[:page].to_i
    # Retrieve total of requests 
    @total = Request.where( requests: { city: params[:city], status_id: 1}).count

    # Getting the total pages
    @total_pages = @total / @limit
    # If total % limit is greater than 0, add one more page 
    if @total % @limit > 0 
      @total_pages += 1
    end

    # Retrieve the requests from the db 
    @request = Request.includes(:volunteers).where(requests: { city: params[:city]}).offset(@page * @limit).limit(@limit)
    # Render as JSON the requests, user and volunteers of each request, total requests, per_page, total_pages for pagination 
    render json: {request: @request.as_json({except: :user_id,
      :include => [user: {except: [:id, :password_digest, :email, :created_at, :updated_at]}, volunteers: {only: [:id,:user_id]}, request_type: {only: [:name]}, status: {only: [:name]}],
    }),total_requests: @total, per_page: @limit, total_pages: @total_pages}
  end

  def my_requests
    # Limit of requests that we want to display 
    @limit = 4
    # Defining the page (@page can be used to return the current page), the page starts on 0
    @page = params[:page].to_i
    # Retrieve total of requests 
    @total = Request.where( requests: {status_id: 1, user_id: params[:user_id]}).count

    # Getting the total pages
    @total_pages = @total / @limit
    # If total % limit is greater than 0, add one more page 
    if @total % @limit > 0 
      @total_pages += 1
    end

    # Retrieve the requests from the db 
    @request = Request.includes(:volunteers).where(requests: { status_id: 1, user_id: params[:user_id]}).offset(@page * @limit).limit(@limit)
    # Render as JSON the requests, user and volunteers of each request, total requests, per_page, total_pages for pagination 
    render json: {request: @request.as_json({except: :user_id,
      :include => [volunteers: {only: [:id,:user_id]}],
    }),total_requests: @total, per_page: @limit, total_pages: @total_pages}
  end

  def requests_voluntereed
    @user  = User.find(params[:user_id])
    # Limit of requests that we want to display 
    @limit = 3
    # Defining the page (@page can be used to return the current page), the page starts on 0
    @page = params[:page].to_i
    # Retrieve total of requests 
    @total = @user.volunteered_requests.count

    # Getting the total pages
    @total_pages = @total / @limit
    # If total % limit is greater than 0, add one more page 
    if @total % @limit > 0 
      @total_pages += 1
    end
    
    @volunteer = @user.volunteered_requests.offset(@page * @limit).limit(@limit)
    render json: {volunteer: @volunteer.as_json,total_requests: @total, per_page: @limit, total_pages: @total_pages}
  end

  def show
    @request = Request.find(params[:id])
    user = User.where("id in (?)", @request.user_id)
    render json: {user: user, request: @request}, :except => [:password_digest] 
  end

  def create
    @request = Request.create(requests_params)
    respond_with :api, :v1, @request, location: -> { api_v1_requests_url(@request) }
  end


  def counter
   respond_with Request.where("status_id = (?)", 1).count
  end

  def destroy
    respond_with Request.destroy(params[:id])
  end

  def update
    requests = Request.find(params["id"])
    requests.update_attributes(requests_params)
    respond_with requests, json: requests
  end

  private

  def requests_params
    params.require(:request).permit(:description, :lat, :lng, :request_type_id, :user_id, :status_id, :city)
  end
end
