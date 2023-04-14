import React, { useEffect, useState } from "react";
import { deleteNotification, getNotification } from "../../apis/ApiData";
import moment from "moment-with-locales-es6";
import Skeleton from "react-loading-skeleton";
import { ToastContainer, toast } from "react-toastify";
moment.locale("es");
export const UsersNotification = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getNotification();
      setProducts(data.data.responseNotification);
      setLoading(false);
    })();
  }, []);

  const filterModuls = products.filter((product) => product.type === "users");
  const deleteproduc = async (id) => {
    let response = await deleteNotification(id);
    if (response.status === 200) {
      toast.success("Notificación eliminada exisosamente", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      const data = await getNotification();
      setProducts(data.data.responseNotification);
    } else {
      toast.error("Error al eliminar la notificación", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <>
      <ToastContainer />
      {loading === true ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 mx-auto gap-4 p-4">
          <Skeleton
            count={1}
            height={100}
            style={{ margin: "0 auto", width: "100%" }}
            className="mx-auto"
            duration={2}
            loading={loading}
          />
          <Skeleton
            count={1}
            height={100}
            style={{ margin: "0 auto", width: "100%" }}
            className="mx-auto"
            duration={2}
            loading={loading}
          />
          <Skeleton
            count={1}
            height={100}
            style={{ margin: "0 auto", width: "100%" }}
            className="mx-auto"
            duration={2}
            loading={loading}
          />
          <Skeleton
            count={1}
            height={100}
            style={{ margin: "0 auto", width: "100%" }}
            className="mx-auto"
            duration={2}
            loading={loading}
          />
        </div>
      ) : (
        <>
          <div className="div">
            <h3 className="text-xl m-4 font-mediumbold text-gray-700">
              Notificaciones {filterModuls.length}
            </h3>
          </div>
          <div className="grid grid-cols-2 mx-auto gap-4 p-4 ">
            {filterModuls.map((modules) => (
              <div
                key={modules._id}
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                }}
                className="w-full rounded-lg  relative cursor-pointer"
              >
                <div
                  className="delete absolute  right-0"
                  onClick={() => {
                    deleteproduc(modules._id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M16 18q-.425 0-.713-.288T15 17q0-.425.288-.713T16 16h2q.425 0 .713.288T19 17q0 .425-.288.713T18 18h-2Zm0-8q-.425 0-.713-.288T15 9q0-.425.288-.713T16 8h5q.425 0 .713.288T22 9q0 .425-.288.713T21 10h-5Zm0 4q-.425 0-.713-.288T15 13q0-.425.288-.713T16 12h4q.425 0 .713.288T21 13q0 .425-.288.713T20 14h-4ZM5 19q-.825 0-1.413-.588T3 17V8q-.425 0-.713-.288T2 7q0-.425.288-.713T3 6h3v-.5q0-.425.288-.713T7 4.5h2q.425 0 .713.288T10 5.5V6h3q.425 0 .713.288T14 7q0 .425-.288.713T13 8v9q0 .825-.588 1.413T11 19H5Z"
                    />
                  </svg>
                </div>
                <h2 className="font-bold mx-2  ">{modules.title}</h2>
                <div>
                  <p className="m-2 font-sans text-gray-500">
                    {modules.description}
                  </p>
                  <div className="fecha">
                    <p className="m-2 font-sans font-semibold text-[#1e95e5]">
                      {moment(modules.createdAt).format("LLLL")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};
