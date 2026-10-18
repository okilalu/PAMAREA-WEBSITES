import {
  AddCircle,
  Additem,
  ArrowDown2,
  CloseCircle,
  Edit,
  HashtagDown,
  Location,
  LocationDiscover,
  Radio,
  SecurityUser,
  Sun,
  Task,
  TaskSquare,
  TickCircle,
  Trash,
} from "iconsax-react";
import React, { useMemo, useState } from "react";
import { usePatrolPoints } from "../hooks/patrol-point/usePatrolPoints";
import {
  useActiveQuestions,
  useCreateQuestion,
  useCreateQuestionOption,
  useDeactivateQuestion,
  useQuestions,
} from "../hooks/question/useQuestions";
import type {
  CreateQuestionOptionPayload,
  PhotoRequirement,
  QuestionType,
} from "../types";

const QuestionBuilder = () => {
  const [patrolPointId] = useState("");
  const { data: activeQuestions } = useActiveQuestions(patrolPointId);
  // const [selectedCheckpointQuestion, setselectedCheckpointQuestion] =
  //   useState("");

  // const questionBuilder = [
  //   {
  //     id: 1,
  //     ids: "Q-Sec-001",
  //     question:
  //       "Apakah kondisi pagar di area checkpoint dalam kondisi baik dan tidak mengalami kerusakan?",
  //     type: "YES_NO",
  //     required: true,
  //     requireReasonIfNo: true,
  //     category: "Keamanan Area",
  //     status: "Aktif",
  //     checkpoint: "Gedung Kontrol",
  //   },
  //   {
  //     id: 2,
  //     ids: "Q-Sec-001",
  //     question:
  //       "Apakah pintu atau akses masuk checkpoint dalam kondisi tertutup dan terkunci dengan baik?",
  //     type: "YES_NO",
  //     required: true,
  //     requireReasonIfNo: true,
  //     category: "Akses",
  //     status: "Aktif",
  //     checkpoint: "Gedung Kontrol 2",
  //   },
  //   {
  //     id: 3,
  //     ids: "Q-Sec-001",
  //     question:
  //       "Apakah area sekitar checkpoint bebas dari benda mencurigakan atau barang yang tidak seharusnya berada di lokasi?",
  //     type: "YES_NO",
  //     required: true,
  //     requireReasonIfNo: true,
  //     category: "Keamanan Area",
  //     status: "Aktif",
  //     checkpoint: "Gedung Kontrol",
  //   },
  //   {
  //     id: 4,
  //     ids: "Q-Sec-001",
  //     question:
  //       "Apakah lampu penerangan di sekitar checkpoint berfungsi dengan baik?",
  //     type: "YES_NO",
  //     required: true,
  //     requireReasonIfNo: true,
  //     category: "Fasilitas",
  //     status: "Aktif",
  //     checkpoint: "Gedung Kontrol 2",
  //   },
  //   {
  //     id: 5,
  //     ids: "Q-Sec-001",
  //     question:
  //       "Apakah CCTV di sekitar checkpoint terlihat aktif dan tidak mengalami gangguan?",
  //     type: "YES_NO",
  //     required: true,
  //     requireReasonIfNo: true,
  //     category: "Monitoring",
  //     status: "Aktif",
  //     checkpoint: "Gedung Kontrol 2",
  //   },
  //   {
  //     id: 6,
  //     ids: "Q-Sec-001",
  //     question:
  //       "Apakah kondisi peralatan keselamatan di sekitar checkpoint dalam keadaan lengkap dan mudah diakses?",
  //     type: "YES_NO",
  //     required: true,
  //     requireReasonIfNo: true,
  //     category: "Keselamatan",
  //     status: "Aktif",
  //     checkpoint: "Gedung Kontrol 2",
  //   },
  //   {
  //     id: 7,
  //     ids: "Q-Sec-001",
  //     question:
  //       "Apakah tidak terdapat genangan air atau kondisi lingkungan yang berpotensi membahayakan di sekitar checkpoint?",
  //     type: "YES_NO",
  //     required: true,
  //     requireReasonIfNo: true,
  //     category: "Lingkungan",
  //     status: "Aktif",
  //     checkpoint: "Gedung Kontrol",
  //   },
  //   {
  //     id: 8,
  //     ids: "Q-Sec-001",
  //     question:
  //       "Apakah area checkpoint dalam kondisi bersih dan bebas dari sampah atau material yang mengganggu?",
  //     type: "YES_NO",
  //     required: true,
  //     requireReasonIfNo: true,
  //     category: "Kebersihan",
  //     status: "Aktif",
  //     checkpoint: "Gedung Kontrol 2",
  //   },
  //   {
  //     id: 9,
  //     ids: "Q-Sec-001",
  //     question:
  //       "Apakah terdapat aktivitas atau orang yang mencurigakan di sekitar checkpoint?",
  //     type: "YES_NO",
  //     required: true,
  //     requireReasonIfNo: true,
  //     category: "Keamanan",
  //     status: "Aktif",
  //     checkpoint: "Gedung Kontrol",
  //   },
  //   {
  //     id: 10,
  //     ids: "Q-Sec-001",
  //     question:
  //       "Apakah seluruh kondisi checkpoint secara keseluruhan dalam keadaan aman dan normal?",
  //     type: "YES_NO",
  //     required: true,
  //     requireReasonIfNo: true,
  //     category: "Kondisi Umum",
  //     status: "Aktif",
  //     checkpoint: "Gedung Kontrol 2",
  //   },
  // ];

  // const filterQuestion = useMemo(() => {
  //   return questionBuilder.filter((q) => {
  //     return selectedCheckpoint === q.checkpoint;
  //   });
  // }, [selectedCheckpoint]);

  const { data: questions } = useQuestions();
  console.log("QUESTION", JSON.stringify(questions, null, 2));
  const { data: checkpoint } = usePatrolPoints();
  const { mutateAsync: questionBuilder, isPending } = useCreateQuestion();
  const { mutateAsync: deactivateQuestion, isPending: isDeactivating } =
    useDeactivateQuestion();
  const { mutateAsync: createQuestionOption } = useCreateQuestionOption();

  const [code, setCode] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("YES_NO");
  const [isRequired, setIsRequired] = useState<boolean>(true);
  const [photoRequirement, setPhotoRequirement] =
    useState<PhotoRequirement>("NONE");
  const [formError, setFormError] = useState("");

  const [options, setOptions] = useState<CreateQuestionOptionPayload[]>([
    {
      value: "",
      label: "",
      sortOrder: 1,
    },
  ]);

  const [selectedCheckpoint, setSelectedCheckpoint] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  // const [selectedStatus, setSelectedStatus] = useState("");
  const checkpointList = useMemo(() => {
    return [...new Set(checkpoint?.map((q) => q.name))];
  }, [checkpoint]);

  // const statusQuestionList = useMemo(() => {
  //   return [...new Set(questions?.map((q) => q.status))];
  // }, [questions]);

  console.log(checkpointList);

  // const filterQuestionStatus = useMemo(() => {
  //   return activeQuestions?.filter((q) => {
  //     return selectedStatus === q.status;
  //   });
  // }, [selectedStatus, activeQuestions]);

  const handelOpenModal = () => {
    const modal = document.getElementById(
      "question_builder",
    ) as HTMLDialogElement;
    modal.showModal();
  };
  const handleCloseModal = () => {
    const modal = document.getElementById(
      "question_builder",
    ) as HTMLDialogElement;
    modal.close();
  };

  // const resetForm = () => {
  //   setCode("");
  //   setQuestionText("");
  //   setQuestionType("YES_NO");
  //   setIsRequired(true);
  //   setPhotoRequirement("NONE");
  //   // setNoteRequirement("NONE");
  //   setFormError("");
  // };

  // const handleQuestionBuilder = async () => {
  //   const normalizedCode = code.trim();
  //   const normalizedQuestion = questionText.trim();

  //   if (!normalizedCode || !normalizedQuestion) {
  //     setFormError("Kode dan teks pertanyaan wajib diisi.");
  //     return;
  //   }

  //   const payload = {
  //     code: normalizedCode,
  //     questionText: normalizedQuestion,
  //     questionType,
  //     isRequired,
  //     photoRequirement,
  //   };

  //   setFormError("");

  //   try {
  //     await questionBuilder(payload);

  //     console.log("PAYLOAD", JSON.stringify(payload, null, 2));
  //     setCode("");
  //     setQuestionText("");
  //     setQuestionType("YES_NO");
  //     setIsRequired(true);
  //     setPhotoRequirement("NONE");
  //     handleCloseModal();
  //   } catch (error) {
  //     console.log(error);
  //     setFormError("Pertanyaan gagal disimpan. Silakan coba kembali.");
  //   }
  // };

  const handleQuestionBuilder = async () => {
    const normalizedCode = code.trim();
    const normalizedQuestion = questionText.trim();

    if (!normalizedCode || !normalizedQuestion) {
      setFormError("Kode dan teks pertanyaan wajib diisi.");
      return;
    }

    // Validasi khusus SINGLE_CHOICE.
    if (questionType === "SINGLE_CHOICE") {
      if (options.length < 2) {
        setFormError(
          "Tambahkan minimal dua opsi untuk pertanyaan Single Choice.",
        );
        return;
      }

      const hasEmptyOption = options.some(
        (option) => !option.label.trim() || !option.value.trim(),
      );

      if (hasEmptyOption) {
        setFormError("Label dan value semua opsi wajib diisi.");
        return;
      }

      const normalizedValues = options.map((option) =>
        option.value.trim().toLowerCase(),
      );

      if (new Set(normalizedValues).size !== normalizedValues.length) {
        setFormError("Value setiap opsi harus unik.");
        return;
      }
    }

    setFormError("");

    try {
      // 1. Buat pertanyaan terlebih dahulu.
      const createdQuestion = await questionBuilder({
        code: normalizedCode,
        questionText: normalizedQuestion,
        questionType,
        isRequired,
        photoRequirement,
      });

      // 2. Buat opsi hanya untuk SINGLE_CHOICE.
      if (questionType === "SINGLE_CHOICE") {
        await Promise.all(
          options.map((option, index) =>
            createQuestionOption({
              questionId: createdQuestion.id,
              payload: {
                value: option.value.trim(),
                label: option.label.trim(),
                sortOrder: index + 1,
              },
            }),
          ),
        );
      }

      // 3. Reset form setelah seluruh request berhasil.
      setCode("");
      setQuestionText("");
      setQuestionType("YES_NO");
      setIsRequired(true);
      setPhotoRequirement("NONE");

      setOptions([
        {
          value: "",
          label: "",
          sortOrder: 1,
        },
      ]);

      setFormError("");

      handleCloseModal();
    } catch (error) {
      console.error("Gagal membuat pertanyaan atau opsi:", error);

      setFormError(
        "Pertanyaan atau opsi gagal disimpan. Periksa kembali data dan coba lagi.",
      );
    }
  };

  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        value: "",
        label: "",
        sortOrder: prev.length + 1,
      },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((option, i) => ({
          ...option,
          sortOrder: i + 1,
        })),
    );
  };

  const handleOptionChange = (
    index: number,
    field: "value" | "label",
    value: string,
  ) => {
    setOptions((prev) =>
      prev.map((option, i) =>
        i === index
          ? {
              ...option,
              [field]: value,
            }
          : option,
      ),
    );
  };

  const handleDeactivateQuestion = async (id: string) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin nonaktifkan pertanyaan ini?",
    );
    if (!confirmed) return;

    try {
      await deactivateQuestion(id);

      alert("Berhasil menonaktifkan pertanyaan");
      console.log("Pertanyaan berhasil dinonaktifkan.");
    } catch (error) {
      alert("Error saat menonaktifkan pertanyaan");
      console.error("Gagal menonaktifkan pertanyaan:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="px-6 flex justify-between breadcrumbs text-sm bg-white border-b border-gray-200 h-14">
        <ul className="mt-2">
          <li>
            <a className="text-gray-700 font-semibold">Dashboard</a>
          </li>
          <li>
            <a className="text-gray-700 font-semibold">Command Center</a>
          </li>
          <li className="text-gray-700 font-semibold">Add Document</li>
        </ul>
        <div className="flex gap-2">
          <div className="bg-black rounded-full px-2 py-1">
            <p className="text-white text-lg font-bold mt-0.5">LO</p>
          </div>
          <div>
            <h2 className="text-gray-800 text-sm font-semibold">Lalu Oki</h2>
            <p className="text-gray-600 text-xs tracking-wider">
              Chief Patrol Supervisor
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className=" mt-5 grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C]  px-1 py-3 h-[1px] rounded-xs" />
              <p className="font-bold text-2xl tracking-wide">
                Checkpoint Inspection & K3 Question Builder
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Susun urutan pertanyaan inspeksi keselamatan kerja (K3) dan
              verifikasi fisik keamanan per titik checkpoint patroli gardu induk
              secara adaptif.
            </p>
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handelOpenModal}
              className="bg-[#FED400] shadow-sm rounded-lg p-3 cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <div className="bg-[#FED400] p-1 rounded-lg">
                  <Additem size={17} color="#6F5C00" />
                </div>
                <div className="ml-1">
                  <p className="text-gray-900 text-sm font-semibold">
                    Tambah Pertanyaan Baru
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Add Question Modal */}
        <dialog id="question_builder" className="modal">
          <div className="modal-box w-full max-w-2xl rounded-xl p-6 bg-white shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2">
                  <AddCircle size={24} color="#2563eb" variant="Bold" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Tambah Pertanyaan Inspeksi Checkpoint
                  </h3>
                </div>
                {/* <div className="px-2 rounded-lg bg-white">
                  <select
                    id="checkpoint"
                    value={selectedCheckpointQuestion}
                    onChange={(e) =>
                      setselectedCheckpointQuestion(e.target.value)
                    }
                    className="select select-bordered w-full bg-white text-sm"
                  >
                    <option value="" disabled>
                      Pilih checkpoint
                    </option>
                    {checkpointList.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div> */}
              </div>
              <button
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                onClick={handleCloseModal}
              >
                <CloseCircle size={22} color="#6b7280" />
              </button>
            </div>

            {/* --- BODY --- */}
            <div className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="code_text"
                  className="block text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Question Code
                </label>
                <input
                  type="text"
                  placeholder="Q-MSJ001"
                  className="input input-bordered w-full mt-1 bg-white border-gray-100 teext-sm"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              {/* 1. Pertanyaan Inspeksi */}
              <div>
                <label
                  htmlFor="question_text"
                  className="block text-sm font-semibold text-gray-800 mb-1.5"
                >
                  1. Pertanyaan Inspeksi (Question Text)
                </label>
                <textarea
                  id="question_text"
                  name="question_text"
                  className="w-full border border-gray-300 rounded-md bg-gray-50 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 resize-none"
                  placeholder="Contoh: Apakah lampu indikator alarm panel dalam kondisi hijau/normal?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
                <p className="text-[11px] text-gray-500 italic mt-1 flex items-start gap-1">
                  <span className="text-red-500 font-bold">*</span>
                  Gunakan instruksi yang lugas dan tidak ambigu bagi personel
                  satpam di lapangan.
                </p>
              </div>

              {/* 2. Tipe Respon */}
              <div>
                <p className="block text-sm font-semibold text-gray-800 mb-2">
                  2. Tipe Respon (Question Type)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      value: "YES_NO",
                      label: "Yes / No",
                      description: "Pilihan Ya / Tidak untuk kepatuhan SOP",
                      Icon: TickCircle,
                    },
                    {
                      value: "SINGLE_CHOICE",
                      label: "Single Choice",
                      description: "Pilihan ganda dengan satu opsi jawaban",
                      Icon: Radio,
                    },
                    {
                      value: "TEXT",
                      label: "Text",
                      description: "Input catatan atau jawaban berupa teks",
                      Icon: Task,
                    },
                  ].map(({ value, label, description, Icon }) => {
                    const isSelected = questionType === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setQuestionType(value as QuestionType)}
                        className={`flex flex-col p-3 border rounded-lg transition-all text-left ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                            : "border-gray-200 bg-gray-50 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex justify-between items-start w-full mb-1">
                          <span
                            className={`font-bold text-sm uppercase ${
                              isSelected ? "text-blue-700" : "text-gray-700"
                            }`}
                          >
                            {label}
                          </span>

                          <Icon
                            size={20}
                            color={isSelected ? "#2563EB" : "#9CA3AF"}
                          />
                        </div>

                        <p className="text-[11px] text-gray-500 leading-snug">
                          {description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {questionType === "SINGLE_CHOICE" && (
                <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        Opsi Jawaban
                      </h4>

                      <p className="text-xs text-gray-500 mt-1">
                        Tambahkan pilihan jawaban untuk pertanyaan ini.
                      </p>
                    </div>

                    <div className="bg-blue-100 text-blue-700 rounded-full px-3 py-1">
                      <p className="text-xs font-semibold">
                        {options.length} Opsi
                      </p>
                    </div>
                  </div>

                  {/* Daftar opsi */}
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3"
                      >
                        {/* Nomor opsi */}
                        <div className="bg-[#00529C] min-w-8 h-8 rounded-lg flex items-center justify-center mt-1">
                          <span className="text-white text-xs font-bold">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Input opsi */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-w-0">
                          <div>
                            <label
                              htmlFor={`option-label-${index}`}
                              className="block text-xs font-semibold text-gray-700 mb-1.5"
                            >
                              Label Opsi
                            </label>

                            <input
                              id={`option-label-${index}`}
                              type="text"
                              value={option.label}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "label",
                                  e.target.value,
                                )
                              }
                              placeholder="Contoh: Normal"
                              className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`option-value-${index}`}
                              className="block text-xs font-semibold text-gray-700 mb-1.5"
                            >
                              Value Opsi
                            </label>

                            <input
                              id={`option-value-${index}`}
                              type="text"
                              value={option.value}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "value",
                                  e.target.value,
                                )
                              }
                              placeholder="Contoh: NORMAL"
                              className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Tombol hapus */}
                        <button
                          type="button"
                          disabled={options.length <= 1}
                          onClick={() => handleRemoveOption(index)}
                          className="p-2 mt-5 rounded-lg hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Hapus opsi"
                        >
                          <Trash size={17} color="#DC2626" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Tombol tambah opsi */}
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="mt-4 w-full border border-dashed border-blue-300 bg-white hover:bg-blue-50 rounded-lg py-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <AddCircle size={18} color="#00529C" />

                    <span className="text-sm font-semibold text-[#00529C]">
                      Tambah Opsi Jawaban
                    </span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                {/* 3. Persyaratan Foto */}
                <div>
                  <p className="block text-sm font-semibold text-gray-800 mb-3">
                    3. Persyaratan Foto Bukti
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { value: "NONE", label: "NONE (Tidak Perlu Foto)" },
                      {
                        value: "REQUIRED",
                        label: "REQUIRED (Foto Selalu Wajib)",
                      },
                      {
                        value: "CONDITIONAL",
                        label: "CONDITIONAL (Jika Ada Temuan)",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="photo_req"
                          value={option.value}
                          checked={photoRequirement === option.value}
                          onChange={() =>
                            setPhotoRequirement(
                              option.value as PhotoRequirement,
                            )
                          }
                          className="radio radio-primary radio-sm"
                        />

                        <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 4. Persyaratan Catatan (Diperbaiki dari duplikat sebelumnya) */}
                {/* <div>
                  <p className="block text-sm font-semibold text-gray-800 mb-3">
                    4. Persyaratan Catatan Tambahan
                  </p>
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="note_req"
                        value="required"
                        className="radio radio-primary radio-sm"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                        REQUIRED (Wajib Diisi)
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="note_req"
                        value="none"
                        className="radio radio-primary radio-sm"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                        OPSIONAL (Tidak Wajib)
                      </span>
                    </label>
                  </div>
                </div> */}
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                className="px-5 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={handleCloseModal}
              >
                Batal
              </button>

              {formError && (
                <p className="text-sm text-red-600 mr-auto">{formError}</p>
              )}
              <button
                className="px-5 py-2 text-sm font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-500 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                disabled={isPending}
                onClick={handleQuestionBuilder}
              >
                {isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </dialog>
        {/* Add Question Modal */}

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-lg flex items-center justify-between px-3 py-2">
            <div className="flex items-center ">
              <Location size={17} color="gray" />
              <div className="ml-2">
                <p className="text-gray-500 text-xs">
                  Titik Checkpoint Terpilih :
                </p>
                <p className="font-semibold text-gray-500 text-xs">
                  {selectedCheckpoint || "Tidak ada checkpoint terpilih"}
                </p>
              </div>
            </div>

            <div className="bg-[#D5E3FF] rounded-lg px-3 py-1 ml-4">
              <p className="font-semibold text-xs text-[#001B3B]">
                {activeQuestions?.length} Pertanyaan Aktif
              </p>
            </div>
          </div>

          <div className="flex bg-gray-100 rounded-lg px-3 py-2 gap-4">
            <div className="dropdown dropdown-start w-[50%]">
              <div
                tabIndex={0}
                role="button"
                className="bg-gray-200 rounded-sm px-3 py-2 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <LocationDiscover
                      size={17}
                      color="gray"
                      className="shrink-0"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 text-start">
                        Checkpoint:
                      </p>

                      <p className="text-xs text-gray-600 font-semibold truncate">
                        {selectedCheckpoint || "Pilih Checkpoint"}
                      </p>
                    </div>
                  </div>
                  <ArrowDown2 size={17} color="gray" className="shrink-0" />
                </div>
              </div>

              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-gray-100 rounded-lg z-10 w-64 p-2 mt-1 shadow-md border border-gray-200"
              >
                {checkpointList.map((checkpoint) => (
                  <li key={checkpoint}>
                    <button
                      type="button"
                      onClick={() => setSelectedCheckpoint(checkpoint)}
                      className="text-xs text-gray-600 hover:bg-gray-200 rounded-md"
                    >
                      {checkpoint}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dropdown dropdown-start flex-1">
              <div
                tabIndex={0}
                role="button"
                className="bg-gray-200 rounded-sm px-3 py-2 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <SecurityUser size={17} color="gray" className="shrink-0" />

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Pilih Shift:</p>

                      <p className="text-xs text-gray-600 font-semibold">
                        {selectedShift || "Pilih Shift"}
                      </p>
                    </div>
                  </div>

                  <ArrowDown2 size={17} color="gray" className="shrink-0" />
                </div>
              </div>

              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-white rounded-lg z-10 w-48 p-2 mt-1 shadow-md border border-gray-200"
              >
                {["Shift 1 (Pagi)", "Shift 2 (Siang)", "Shift 3 (Malam)"].map(
                  (shift) => (
                    <li key={shift}>
                      <button
                        type="button"
                        onClick={() => setSelectedShift(shift)}
                        className="text-xs text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        {shift}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* <div className="dropdown dropdown-start flex-1">
              <div
                tabIndex={0}
                role="button"
                className="bg-gray-200 rounded-sm px-3 py-2 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <SecurityUser size={17} color="gray" className="shrink-0" />

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Pilih Status:</p>

                      <p className="text-xs text-gray-600 font-semibold">
                        {selectedStatus || "Pilih Status"}
                      </p>
                    </div>
                  </div>

                  <ArrowDown2 size={17} color="gray" className="shrink-0" />
                </div>
              </div>

              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-white rounded-lg z-10 w-48 p-2 mt-1 shadow-md border border-gray-200"
              >
                {statusQuestionList.map((status) => (
                  <li key={status}>
                    <button
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className="text-xs text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      {status}
                    </button>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* <button className="bg-gray-200 rounded-sm w-[50%] px-2 py-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SecurityUser size={17} color="gray" />
                  <div>
                    <p className="text-xs text-gray-500 text-start">
                      Pilih Shift:
                    </p>
                    <p className="text-xs text-gray-500 font-semibold">
                      Shift 2 (Siang)
                    </p>
                  </div>
                </div>
                <ArrowDown2 size={17} color="gray" />
              </div>
            </button> */}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
            <TaskSquare size={20} color="black" />
            <div>
              <h1 className="font-bold text-xl">
                Urutan Pertanyaan Terdaftar ({activeQuestions?.length})
              </h1>
            </div>
          </div>

          <div className=" mt-3">
            {(activeQuestions?.length ?? 0 > 0) ? (
              activeQuestions?.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between mb-4 bg-white rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2 ">
                    <div className="bg-[#00529C] px-3 py-1 rounded-lg">
                      <p className="text-white text-md">
                        {String(index + 1).padStart(2)}
                      </p>
                    </div>
                    <div className="ml-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-[#E5EBF1] flex items-center gap-1 rounded-full px-2 py-0.5">
                          <HashtagDown size={12} color="#0D457A" />
                          <p className="text-xs text-[#0D457A] font-semibold">
                            {item.questionType}
                          </p>
                        </div>
                        <div className="bg-[#FEF2B2] flex items-center  gap-1 rounded-full px-2 py-0.5">
                          <Sun size={12} color="#7B680F" />
                          <p className="text-xs text-[#7B680F] font-semibold">
                            {item.status}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-semibold">
                        {item.questionText}
                      </p>
                      <div className="flex items-center  gap-2">
                        <div className="flex items-center">
                          <p className="text-xs text-gray-500">ID :</p>
                          <p className="text-xs text-gray-500 font-semibold ml-1">
                            {item.code}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <p className="text-xs text-gray-500">Kategori :</p>
                          <p className="text-xs text-gray-500 font-semibold ml-1">
                            {item._count?.pointQuestions}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 cursor-pointer">
                      <Edit size={17} color="gray" />
                      <p className="text-xs text-gray-500 tracking-wide">
                        Edit
                      </p>
                    </button>
                    <button
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleDeactivateQuestion(item.id)}
                      disabled={isDeactivating}
                    >
                      <Trash size={17} color="red" />
                      <p className="text-xs text-rose-700 tracking-wide">
                        {isDeactivating ? "Menonaktifkan..." : "Nonaktifkan"}
                      </p>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg py-12 mb-4 flex flex-col items-center justify-center">
                <div className="bg-gray-100 rounded-full p-4 mb-3">
                  <TaskSquare size={28} color="#9CA3AF" />
                </div>

                <p className="text-gray-700 font-semibold text-sm">
                  Tidak ada data
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  Data pertanyaan tidak ditemukan
                </p>
              </div>
            )}
          </div>
        </div>

        {(activeQuestions?.length ?? 0 > 0) ? (
          <button className="bg-gray-200 rounded-lg py-3 w-full">
            <div className="flex items-center justify-center gap-2 flex-1">
              <AddCircle size={17} color="gray" />
              <p className="text-gray-500 font-semibold text-sm capitalize">
                Sisipkan pertanyaan baru pada checkpoint ini
              </p>
            </div>
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default QuestionBuilder;
