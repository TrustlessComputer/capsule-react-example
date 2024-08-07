import {
  Button,
  Tooltip,
  Text,
  HStack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useSendNativeToken } from "../../../../hooks/api/useSendNativeToken";
import { useNFTStore } from "../../../../stores/useNFTStore";
import {useHasMintedNFT} from "../../../../hooks/api/useHasMintedNFT";

interface MintNFTProps {
  walletId: string;
  walletAddress: string;
}

export const MintNFT = ({ walletId, walletAddress }: MintNFTProps) => {
  const toast = useToast();
  const setHasMintedNFT = useNFTStore((state) => state.setHasMintedNFT);
  const { data: hasMintedNFT, isLoading: isHasMintedNFTLoading } =
    useHasMintedNFT(walletAddress, walletId);

  const {
    mutate: sendTx,
    isPending: isSendTxPending,
    isSuccess: isSendTxSuccess,
    isError: isSendTxError,
    reset: resetSendTx,
  } = useSendNativeToken(walletAddress, walletId);

  // Update local storage when api resolves
  useEffect(() => {
    if (hasMintedNFT) {
      setHasMintedNFT(walletId);
    }
  }, [hasMintedNFT]);

  const handleSendTx = () => {
    sendTx(undefined, {
      onSuccess: () => {
        toast({
          title: "Successfully!",
          status: "success",
          isClosable: true,
        });
      },
      onError: () => {
        toast({
          title:
            "Failed to send transaction. The network may be too busy to handle this request. Please check back later or ask Capsule for assistance.",
          status: "error",
          isClosable: true,
        });
        setTimeout(() => {
          resetSendTx();
        }, 5000);
      },
    });
  };

  return (
    <VStack width="100%">
      <HStack width="100%" justifyContent="space-between">
        <Text>1. Send the Native Token</Text>
        <Tooltip
          placement="right"
          color="white"
          label="Congratulations! You have minted the Capsule NFT. Click again to mint again!"
          // isDisabled={!localHasMintedNFT}
        >
          <Button
            width="150px"
            height="50px"
            backgroundColor={
              isSendTxError
                ? "red"
                : isSendTxPending
                ? "blue"
                : isSendTxSuccess
                ? "green"
                : "#080B0F"
            }
            _hover={{ backgroundColor: "#080B0F80" }}
            onClick={handleSendTx}
            isDisabled={
              isSendTxPending || isSendTxError || isHasMintedNFTLoading
            }
          >
            <Text color="white" fontSize="14px">
              {isSendTxError
                ? "Failed!"
                : isSendTxPending
                ? "Pending..."
                : isSendTxSuccess
                ? "Sent!"
                : "Send!"}
            </Text>
          </Button>
        </Tooltip>
      </HStack>
    </VStack>
  );
};
