""" from fastapi import FastAPI, HTTPException, Query
import json
import predict

app = FastAPI()


@app.get("/api")
def query_example(data: str = Query(None)):
    if data is None:
        response = {"result": -1}
    else:
        print("data is not None")
        try:
            print("RECEIVED_CONFIG: ", data)
            student = json.loads(data)
            result = int(predict.predict(student)["good_employee"])
            print("RESULT: ", result)
            response = {"result": result}
        except Exception as e:
            print(e)
            response = {"result": -1}
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info") """

from flask import Flask, request
import json
import predict

app = Flask(__name__)


@app.route("/api")
def query_example():
    try:
        user_config = request.args.get("data")
        print("RECEIVED_CONFIG: ", user_config)
        student = json.loads(user_config)
        result = int(predict.predict(student)["good_employee"])
        print("RESULT: ", result)
        response = {"result": result}
    except Exception as e:
        print(e)
        response = {"result": -1}
    return json.dumps(response)


if __name__ == "__main__":
    app.run(port = 8080)


# Below is for flask
# http://127.0.0.1:5000/api?data={%22Student%20ID%22:%22123%22,%22Gender%22:%22M%22,%22Age%22:20,%22Major%22:%22Computer%20Science%22,%22GPA%22:3.5,%22Extra%20Curricular%22:%22Sorority%22,%22Num%20Programming%20Languages%22:5,%22Num%20Past%20Internships%22:3}
# For fast api, port will be 8000
# To run fast api: uvicorn app:app --reload
# Tu run flask: run flask
