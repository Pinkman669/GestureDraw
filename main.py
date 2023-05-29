from sanic import Sanic
from sanic.response import json
from sanic import response
import FingersClick

app = Sanic("project")

@app.get('/')
def test(request):
    # img = FingersClick.main()
    # obj = response.ResponseStream(streaming_fn=img, content_type='multipart/x-mixed-replace; boundary=frame')
    # print(obj)
    return response.text('hi')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, single_process=True)